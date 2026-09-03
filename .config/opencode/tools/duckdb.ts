import { tool, type ToolContext } from "@opencode-ai/plugin";
import { DuckDBInstance } from '@duckdb/node-api';
import { encode } from "@toon-format/toon";

const MAX_ROWS = 1024;

function buildTool(options: Record<string, string>) {
  return tool({
    description: "Execute a SQL statement on DuckDB. If no `database_path` is provided, a new in-memory database is used for each query. DuckDB is a good tool also to query Parquet and CSV files. By loading the `sqlite` extension, you can attach to sqlite files, but using the DuckDB syntax.",
    args: {
      statement: tool.schema.string(),
      args: tool.schema.array(tool.schema.any()).optional(),
      database_path: tool.schema.string().optional(),
      limit: tool.schema.number().min(1).max(MAX_ROWS).default(MAX_ROWS)
    },
    async execute({ statement, args, database_path, limit }, context: ToolContext): Promise<string> {
      if(!database_path) options = { ...options, "access_mode": "READ_WRITE" };
      const db = await DuckDBInstance.create(database_path || ":memory:", options);
      const con = await db.connect();

      try {
        const reader = await con.streamAndRead(statement, args || []);
        await reader.readUntil(limit + 1);
        const rows = reader.getRowObjectsJson();
        const hasMore = rows.length > limit;
        const res = encode(rows.slice(0, limit));

        return hasMore ? `${res}\n[Output truncated]` : res;
      } finally {
        db.closeSync();
      }
    }
  });
}

// see https://duckdb.org/docs/current/configuration/overview
const globalOptions = { "allow_community_extensions": "false" };

export const query_readonly = buildTool({ "access_mode": "READ_ONLY", ...globalOptions });
export const query = buildTool({ "access_mode": "READ_WRITE", ...globalOptions });
