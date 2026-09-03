---
name: coder-postgresql
description: Write efficient database schemas and queries for PostgreSQL.
compatibility: opencode
---
You enforce efficient, performant, maintainable, and consistent database usage.

# PostgreSQL Developer Guidelines

## 1. Naming Conventions

Consistency in naming is non-negotiable. Every object must follow these rules.

### 1.1 General Rules

| Rule | Convention | Example |
|---|---|---|
| Case | `snake_case` everywhere | `order_items`, not `OrderItems` |
| Language | American English | `color`, not `colour` |
| Max length | 63 characters (PostgreSQL limit) | — |
| Reserved words | **NEVER** use SQL reserved words as identifiers | no `user`, `order`, `group`, `table` |
| Abbreviations | Avoid unless universally understood | `qty` ✗ → `quantity` ✓ ; `id` ✓, `url` ✓ |
| Prefixes/Suffixes | No type-encoding prefixes (`tbl_`, `vw_`, `fn_`) | `customers`, not `tbl_customers` |

### 1.2 Specific Object Naming

| Object | Convention | Example |
|---|---|---|
| **Tables** | Plural nouns | `customers`, `order_items` |
| **Columns** | Singular, descriptive | `email_address`, `created_at` |
| **Primary Key** | Unique name across all tables | `customer_id` |
| **Foreign Key column** | Same column name as the referenced column | `customer_id` → references `customer_id` |
| **Foreign Key constraint** | `fk_<table>_<referenced_table>` | `fk_orders_customers` |
| **Boolean columns** | `is_`, `has_`, `can_` prefix | `is_active`, `has_discount` |
| **Timestamp columns** | `_at` suffix | `created_at`, `updated_at`, `deleted_at` |
| **Date columns** | `_on` suffix | `hired_on`, `due_on` |
| **Indexes** | `ix_<table>_<columns>` | `ix_orders_customer_id` |
| **Unique indexes** | `ux_<table>_<columns>` | `ux_users_email` |
| **Check constraints** | `ck_<table>_<description>` | `ck_orders_positive_amount` |
| **Unique constraints** | `uq_<table>_<columns>` | `uq_products_sku` |
| **Sequences** | `<table>_<column>_seq` | `customers_id_seq` |
| **Enums** | Singular noun | `order_status`, not `order_statuses` |
| **Views** | Descriptive, no prefix | `active_subscriptions` |
| **Functions** | `verb_noun` | `calculate_total`, `get_customer_balance` |
| **Triggers** | `trg_<table>_<event>_<timing>` | `trg_orders_update_before` |

### 1.3 Schema (Namespace) Usage

- Use schemas to logically separate functional domains: `billing.invoices`, `auth.sessions`, `catalog.products`.
- The `public` schema is **not** to be used for application tables. It is reserved for shared extensions.
- Every migration must explicitly specify the target schema.

## 2. Schema Design Rules

### 2.1 Table Design

- Normalize to **3NF** by default. Denormalize only with documented justification and user approval.
- Every denormalization must have a comment in the migration explaining the reason and the read/write tradeoff.
- Every table has a `BIGINT GENERATED ALWAYS AS IDENTITY` primary key, unless a natural (possibly composite) PK is justified and approved.
- Every table has `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`.
- Every table that will be updated must have `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` with a trigger to auto-update it.
- Use `COMMENT ON` for every table and every non-obvious column.
- Never use `SERIAL` or `BIGSERIAL` — use `GENERATED ALWAYS AS IDENTITY`.
- Never use `UUID` as primary key without explicit justification (UUID leads to index bloat, poor cache locality). If UUIDs are needed for external exposure, add a separate `public_id UUID DEFAULT uuidv7()` column with a unique index.

### 2.2 Soft Deletes vs Hard Deletes

- Because of privacy regulation, it may be illegal to hold data which had been requested to be deleted. Use the `skill` tool to load guidelines related to data privacy.
- If the business requires soft deletes, add a `deleted_at TIMESTAMPTZ` column (nullable, `NULL` = not deleted).
- **ALWAYS** add a partial index: `CREATE INDEX ix_<table>_active ON <table>(...) WHERE deleted_at IS NULL;`
- Application queries **must** filter on `WHERE deleted_at IS NULL` by default. Consider using a view.

### 2.3 Partitioning

- Tables expected to exceed **50 million rows** must be designed with partitioning from day one.
- Check which index would be used to access the table, and suggest a partitioning on the column(s) minimizing the number of partitions to be loaded for common queries.
- Always discuss partition strategy with the user before implementation.

### 2.4 Inheritance & Table Anti-Patterns

- **NEVER** use PostgreSQL table inheritance for application modeling. Use proper relational patterns instead.
- **NEVER** create Entity-Attribute-Value (EAV) tables. Use `JSONB` if truly dynamic attributes are needed.
- **NEVER** store comma-separated values in a column. Use array types or junction tables.

## 3. Data Types

### 3.1 Type Selection Rules

| Data | Correct Type | Wrong Type | Rationale |
|---|---|---|---|
| Identifiers (PKs, FKs) | `BIGINT` | `INTEGER`, `UUID` | Future-proof, excellent performance |
| Short text (name, title) | `TEXT` | `VARCHAR(n)` | `TEXT` with a `CHECK` constraint is more flexible |
| Long text | `TEXT` | `VARCHAR`, `CHAR` | No performance difference in PostgreSQL |
| Money / currency | `NUMERIC(19,4)` | `FLOAT`, `DOUBLE PRECISION`, `MONEY`, `INTEGER` (cents) | Avoids floating-point rounding. `MONEY` depends on the `lc_monetary` settings which may be fragile. |
| Timestamps | `TIMESTAMP` (without TZ) or `TIMESTAMPTZ` | | Favor storing the timezone where the event or action originated. If none, use UTC. |
| Dates | `DATE` | `TEXT`, `TIMESTAMPTZ` | Use the correct type for date-only |
| Booleans | `BOOLEAN` | `INTEGER`, `CHAR(1)` | Native support |
| IP addresses | `INET` | `TEXT` | Native operators, indexing |
| JSON documents | `JSONB` | `JSON`, `TEXT` | `JSONB` is binary, indexable, and faster |
| Enumerations (≤ 15 values) | `CREATE TYPE ... AS ENUM` | `TEXT`, `INTEGER` | Type safety, storage efficiency |
| Enumerations (> 15 or frequently changing) | Lookup/reference table | `ENUM` | ENUMs are hard to modify |
| File/binary data | External storage (S3) + URL | `BYTEA` | Don't bloat the database |
| Arrays | `ARRAY` type | Junction table (if simple) | Appropriate for small, non-relational lists |
| Embeddings / vectors | `vector(n)` (pgvector) | `REAL[]`, `JSONB` | Native ANN indexing, distance operators |
| Full-text searchable content | `tsvector` (generated column) | `TEXT` with runtime `to_tsvector()` | Pre-computed, indexable |

### 3.2 Strict Rules

- **NEVER** use `CHAR(n)` — it pads with spaces and causes subtle bugs.
- **NEVER** store dates or timestamps as strings.
- **NEVER** use `NUMERIC` without specifying precision/scale when used for money.
- **ALWAYS** use `TIMESTAMPTZ`, never bare `TIMESTAMP`.
- **ALWAYS** set explicit `DEFAULT` values where business logic demands them.

## 4. Indexing Strategy

### 4.1 Mandatory Indexes

| Scenario | Recommended Strategy |
|---|---|
| Primary key | Automatic (B-tree) |
| Foreign key columns | **ALWAYS** create an index. PostgreSQL does NOT auto-index FKs. |
| Columns in `WHERE` clauses of frequent queries | B-tree index |
| Columns in `ORDER BY` of paginated queries | Composite index including sort columns |
| Columns with low cardinality in filters | Partial index or BRIN index |
| Full-text search | GIN index on `tsvector` |
| JSONB queries | GIN index with `jsonb_path_ops` |
| Geospatial queries | GiST index (PostGIS) |
| Vector similarity search | HNSW or IVFFlat index (pgvector) |

### 4.2 Index Types — When to Use What

| Index Type | Best For | Internal Structure | Limitations |
|---|---|---|---|
| **B-tree** (default) | Equality, range, sorting, `LIKE 'prefix%'` | Balanced tree | Cannot handle full-text, similarity, or ANN |
| **GIN** (Generalized Inverted Index) | Full-text search, JSONB containment, arrays, trigrams | Inverted posting lists | Slower writes, larger on disk, no range scans |
| **GiST** (Generalized Search Tree) | Geometric, range types, exclusion constraints, FTS (lossy) | Balanced tree of bounding regions | Lossy for FTS (requires recheck), slower than GIN for pure FTS |
| **SP-GiST** | Radix trees, quad-trees, non-balanced partitioned data | Space-partitioned tree | Narrow use cases |
| **BRIN** (Block Range Index) | Large, physically sorted tables (time-series, logs) | Min/max per block range | Only effective on naturally ordered data |
| **Hash** | Pure equality lookups (rare use) | Hash buckets | No range, no ordering, limited WAL support before PG 10 |
| **HNSW** (pgvector) | Approximate nearest neighbor search | Hierarchical navigable small world graph | Memory-intensive during build, higher disk usage |
| **IVFFlat** (pgvector) | ANN on large vector sets with faster build time | Inverted file with flat quantization | Requires `lists` tuning, less accurate than HNSW |

### 4.3 Index Rules

- **ALWAYS** create indexes `CONCURRENTLY` in production migrations.
- **ALWAYS** index foreign key columns.
- Prefer **partial indexes** (`CREATE INDEX ... WHERE ...`) when queries consistently filter on a condition.
- Use **covering indexes** (`CREATE INDEX ... INCLUDE (...)`) for frequent read queries to avoid heap fetches.
- Column order matters in composite indexes: most selective / equality-filtered column first, then range columns.
- **NEVER** create indexes "just in case." Every index must be justified by a query pattern.
- **NEVER** create single-column indexes on boolean columns alone (very low selectivity). Use partial indexes instead.
- **NEVER** have more than **8 indexes per table** without user review (write performance impact).
- **NEVER** use floating-point numbers or timestamps as part of a Primary Key. Dates are allowed.
- Drop unused indexes — they cost write performance and disk space for nothing.

## 5. Constraints & Data Integrity

### 5.1 The Golden Rule

> **The database is the last line of defense.** Never rely solely on application code for data integrity. Every business rule that can be expressed as a constraint **must** be a constraint.

### 5.2 Mandatory Constraints

| Type | Rule |
|---|---|
| `NOT NULL` | Every column is `NOT NULL` unless there is a valid business reason for `NULL`. Document why as a comment on the column. |
| `FOREIGN KEY` | Every relationship must have an FK constraint. No exceptions. |
| `CHECK` | Validate domains: positive amounts, valid ranges, string formats, etc. |
| `UNIQUE` | Enforce natural uniqueness: email, SKU, slug, etc. |
| `EXCLUDE` | Use for range overlap prevention (e.g., booking systems). |

### 5.3 Foreign Key Actions

| Situation | ON DELETE | ON UPDATE |
|---|---|---|
| Parent is a core entity (customer, product) | `RESTRICT` (default) | `RESTRICT` |
| Child is a dependent detail (order items) | `CASCADE` | `CASCADE` |
| Optional reference (nullable FK) | `SET NULL` | `RESTRICT` |

- **NEVER** use `ON DELETE CASCADE` on tables that hold financial, legal, or auditable data.
- **ALWAYS** explicitly specify the FK action — don't rely on defaults implicitly.

## 6. Query Writing Standards

### 6.1 SQL Formatting Rules

- SQL keywords in **UPPERCASE**: `SELECT`, `FROM`, `WHERE`, `JOIN`, `ON`, `AND`, `OR`, `GROUP BY`, `ORDER BY`, `LIMIT`.
- `JOIN` conditions on the same line as the `JOIN` (or immediately indented below).
- Use **table aliases** (short, meaningful): `c` for `customers`, `oi` for `order_items`.
- Always qualify columns with the table alias in multi-table queries.
- Always use explicit `JOIN` syntax — never comma-separated `FROM` with `WHERE` join conditions.

### 6.2 Parameterized Queries (Mandatory)

- **ALWAYS** use Parameterized Queries for queries that includes external input, this prevents SQL injection attacks.

### 6.3 SELECT Rules

- **NEVER** use `SELECT *` in application code. Always list columns explicitly.
- **NEVER** use `SELECT DISTINCT` to mask a bad join or duplicated data. Fix the query logic.
- **ALWAYS** alias computed or aggregated columns.
- Use `EXISTS` instead of `IN` for correlated subqueries (better optimization).
- Use `count(*)` instead of `count(id)` when counting rows — it's faster and clearer.

### 6.4 Pagination

- **ALWAYS** use keyset (cursor-based) pagination for any list that can grow beyond a few hundred rows.
- `OFFSET` is acceptable only for admin dashboards with small datasets (< 10,000 rows) and never in customer-facing APIs.

### 6.5 Upsert & Conflict Handling

- **ALWAYS** specify the conflict target explicitly, either by column or named unique constraint.
- Use `EXCLUDED` to reference the incoming row in the `SET` statement.
- Only update columns that should actually change.
- Use `WHERE` clause in `DO UPDATE` to avoid no-op writes, by comparing current values to incoming values.

### 6.6 CTE (Common Table Expressions)

- Use CTEs for readability when a query has 3+ logical steps.
- Be aware that **before PostgreSQL 12**, CTEs were optimization fences. In 12+, the planner can inline them.

### 6.7 Avoid Application-Level Joins

- **NEVER** run N+1 query patterns: fetching a list then looping to fetch related rows.
- Use `JOIN`, `LATERAL JOIN`, or batch queries (`WHERE id = ANY(:ids)`).

## 7. Performance Rules

### 7.1 Use EXPLAIN to review queries

Use `EXPLAIN` to understanding performance issues with live queries:

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT ...;
```

**What to look for:**

| Red Flag | Acceptable Alternative |
|---|---|
| `Seq Scan` on a large table (> 10K rows) | `Index Scan`, `Index Only Scan`, `Bitmap Index Scan` |
| `Nested Loop` on large sets | `Hash Join`, `Merge Join` |
| `Sort` with `external merge Disk` | Increase `work_mem` or add index |
| `Rows Removed by Filter:` vastly > actual rows | Missing or wrong index |
| High `Buffers: shared read` | Cold cache or missing index |

### 7.2 Hard Limits

| Rule | Limit |
|---|---|
| Max query execution time (OLTP) | **200ms** (p95) |
| Max rows returned by a single API query (unless justified) | **1,000** (use pagination) |
| Max joins in a single query | **6** (refactor or use materialized views beyond this) |
| Max query length | If a query exceeds **80 lines**, extract logic into a view, function, or CTE chain |
| Batch INSERT size | **1,000–5,000 rows** per statement |
| Bulk UPDATE / DELETE | Use batches with `LIMIT` + loop to avoid long-held locks |

### 7.3 Transaction Discipline

- Keep transactions **as short as possible**. No network calls, no API calls, no user interaction inside a transaction.
- Use `SERIALIZABLE` isolation for transactions.
- Always set a `statement_timeout` at the application connection level (e.g., 10s).
- Use `lock_timeout` to avoid indefinite waits on row/table locks.
- **NEVER** hold a transaction from the application. **ALWAYS** Open and Commit or Rollback a transaction within a function or procedure inside PostgreSQL. 

### 7.4 Connection Management

- Use a connection pooler (e.g. PgBouncer or pgpool) in production.
- Set maximum pool sizes based on: `connections = (CPU cores * 2) + effective_spindle_count`.
- **NEVER** open a new connection per request without pooling.
- **NEVER** use a persistent connection without idle timeout.

### 7.5 Anti-Patterns to Reject in Code Review

| Anti-Pattern | Why It's Bad | Fix |
|---|---|---|
| `SELECT * FROM ...` | Fetches unnecessary data, breaks on schema change | List columns explicitly |
| `WHERE column LIKE '%value%'` | Cannot use B-tree index, full table scan | Use trigram GIN index or full-text search |
| `ORDER BY RANDOM()` | Full table scan + sort | Use `TABLESAMPLE` or application-side logic |
| `NOT IN (subquery)` with NULLs | Returns no rows if subquery has NULLs | Use `NOT EXISTS` |
| Implicit type casts in WHERE | Prevents index usage | Cast explicitly or fix column types |

## 8. Full-Text Search

PostgreSQL has a powerful built-in full-text search (FTS) engine.

### 8.1 Core Concepts

| Concept | Description | Example |
|---|---|---|
| **`tsvector`** | A sorted list of distinct normalized lexemes (words) with positional information | `'quick':1 'brown':2 'fox':3` |
| **`tsquery`** | A search predicate composed of lexemes and boolean operators | `'quick & brown'` |
| **Text search configuration** | Language-specific rules for stemming, stop words, and normalization | `'english'`, `'french'`, `'simple'` |
| **Match operator `@@`** | Returns `TRUE` if a `tsvector` matches a `tsquery` | `ts_content @@ to_tsquery('english', 'fox')` |

### 8.2 Schema Design for FTS

- **Store the `tsvector` as a generated column** — **NEVER** compute it at query time on large tables.
- **Weighting system** — assign importance to different fields:
| Weight | Label | Typical Use | Ranking Multiplier (default) |
|---|---|---|---|
| `A` | Highest | Title, name | 1.0 |
| `B` | High | Subtitle, summary, tags | 0.4 |
| `C` | Medium | Body text | 0.2 |
| `D` | Low (default) | Metadata, comments | 0.1 |
- **ALWAYS** use `GENERATED ALWAYS AS (...) STORED` for the `tsvector` column.
- **ALWAYS** use `setweight()` to differentiate field importance.
- **ALWAYS** wrap source columns in `coalesce(column, '')` to avoid `NULL` propagation.
- Choose the correct text search configuration for your language. Use `'simple'` for multi-language / language-agnostic search (no stemming).
- **NEVER** call `to_tsvector()` in the `WHERE` clause of a query on a large table — it defeats indexing.

### 8.3 Multi-Language FTS

- For tables with content in multiple languages, use `regconfig` dynamically.
- Do not mix different languages in a single `tsvector`, because stemming rules depends on the language.
- If the language is unknown or mixed, use `'simple'` configuration — it tokenizes without stemming, which is safe for any language.

### 8.4 Indexing for FTS — GIN vs GiST

| Characteristic | GIN (preferred) | GiST |
|---|---|---|
| **Read performance** | ⚡ Fast — exact lookups in inverted index | Slower — lossy, requires recheck against heap |
| **Write performance** | Slower — must update posting lists | ⚡ Faster — simpler structure |
| **Index size** | Larger (2–3× GiST) | Smaller |
| **Supports ranking** | ✅ Yes | ✅ Yes |
| **Crash recovery** | ✅ Full WAL support | ✅ Full WAL support |
| **Best for** | Read-heavy search workloads (95%+ of cases) | Write-heavy workloads with infrequent search, or when disk is constrained |
| **Concurrency** | Better under high read concurrency | Acceptable |

**Decision rule:**
> Use **GIN** by default. Only consider **GiST** if your table has a very high write rate (> 5,000 writes/sec) and search is infrequent.

**GIN tuning** — for tables with heavy writes, enable pending list optimization:

```sql
-- Accumulate updates in a pending list, then batch-merge into the GIN tree
CREATE INDEX ix_articles_ts_content_gin
  ON content.articles
  USING GIN (ts_content)
  WITH (fastupdate = on, gin_pending_list_limit = 4096); -- 4MiB pending buffer
```

> `fastupdate = on` is the default. Increase `gin_pending_list_limit` (in KiB) if you see slow background merge operations. Be aware that queries may slow slightly until the pending list is flushed.

### 8.5 Querying FTS

#### Basic Search

Classic example:
```sql
SELECT a.id, a.title, ts_rank_cd(a.ts_content, query) AS rank,
  ts_headline('english', a.title || ' - ' || a.body, query,
    'StartSel=<mark>, StopSel=</mark>, MaxWords=50, MinWords=20'
  ) AS snippet
FROM content.articles AS a,
   to_tsquery('english', 'database & performance') AS query
WHERE a.ts_content @@ query
ORDER BY rank DESC
LIMIT 20;
```

The example above uses `to_tsquery` in the `FROM` clause so that it can be reused for the rank computation and the `WHERE` condition.

#### Building `tsquery` from User Input

| Function | Behavior | Use Case | Example Input → Output |
|---|---|---|
| `websearch_to_tsquery()` | Google-like syntax: quotes, `-`, `OR` | For user-facing search bars — it handles bad input gracefully. | `'"full text" -slow OR fast'` → `'full' <-> 'text' & !'slow' | 'fast'` |
| `phraseto_tsquery()` | Phrase proximity (words must be adjacent) | When word order and adjacency matter. | `'full text'` → `'full' <-> 'text'` |
| `plainto_tsquery()` | Implicit AND between words | For programmatic exact-term search. | `'full text search'` → `'full' & 'text' & 'search'` |
| `to_tsquery()` | Raw operator syntax | If the frontend requires a custom query syntax, then the backend API can translate it into a tsquery. | `'full & (text | content)'` |

#### Ranking Functions

| Function | Algorithm | Use Case |
|---|---|---|
| `ts_rank()` | Term frequency based | General purpose ranking |
| `ts_rank_cd()` | Cover density based — rewards proximity of matched terms | Better for relevance when term proximity matters |

**Normalization flags** (bitmask, pass as 2nd/3rd argument):

| Flag | Effect |
|---|---|
| `0` | Default — raw rank |
| `1` | Divide by `1 + log(document length)` |
| `2` | Divide by document length |
| `4` | Divide by mean harmonic distance between extents |
| `8` | Divide by number of unique words |
| `16` | Divide by `1 + log(unique words)` |
| `32` | Divide by `1 + rank` itself (force range 0–1) |

- ✅ Use `ts_rank_cd(ts_content, query, 32)` as a good default — it normalizes output and rewards proximity.

### 8.6 FTS vs Trigram Similarity

FTS handles stemming and boolean logic but **not typos**.

| Feature | FTS (`tsvector`/`tsquery`) | Trigram (`pg_trgm`) |
|---|---|---|
| Stemming | ✅ `running` becomes `run` | ❌ Exact n-grams |
| Stop word removal | ✅ | ❌ |
| Boolean logic | ✅ `AND`, `OR`, `NOT`, phrases | ❌ |
| Typo tolerance | ❌ | ✅ `postgre` matches `postgresql` |
| `LIKE '%middle%'` acceleration | ❌ | ✅ |
| Best index | GIN on `tsvector` | GIN with `gin_trgm_ops` |

### 8.7 FTS Validation Checklist

- [ ] `tsvector` is a `GENERATED ALWAYS AS ... STORED` column, not computed at query time
- [ ] GIN or GiST index exists on the `tsvector` column
- [ ] Correct `regconfig` chosen for the content language
- [ ] `ts_headline()` used for result snippets (with `MaxWords` set to prevent huge outputs)
- [ ] Trigram index added if typo tolerance is a requirement

## 9. Vector Search with pgvector

[pgvector](https://github.com/pgvector/pgvector) adds native vector storage and approximate nearest neighbor (ANN) search to PostgreSQL. Use it for embedding-based semantic search, recommendation systems, and RAG (Retrieval Augmented Generation) pipelines.

### 9.1 When to Use pgvector

| Use Case | Recommended? |
|---|---|
| Semantic search over < 10M vectors | ✅ Ideal |
| RAG pipeline — retrieve context for LLMs | ✅ Ideal |
| Recommendation engine (item/user similarity) | ✅ Good fit |
| Image/audio similarity (CLIP, etc.) | ✅ Good fit |
| Hybrid keyword + semantic search | ✅ Combine with FTS (Section 8) |
| > 50M vectors, sub-10ms latency required | ⚠️ Evaluate dedicated vector DBs (Chroma, Qdrant, Milvius, or Weaviate) or pgvector with partitioning |
| Real-time training/updating of embeddings | ❌ Use ML infrastructure, store final embeddings in pgvector |

### 9.2 Installation and Setup

```sql
-- Install the extension (requires server-side installation of pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
```

> Ensure the pgvector version matches your needs:
> - **0.5.0+**: HNSW index support
> - **0.7.0+**: Halfvec (half-precision), sparse vectors, binary quantization
> - **0.8.0+**: Iterative index scans, improved parallel builds

### 9.3 Schema Design for Embeddings

- **ALWAYS** specify the exact dimension count: `vector(1536)`, not just `vector`.
- Store **one embedding per chunk**, not one per whole document. Typical chunk size: 256–512 tokens.
- Store the `model_name` and `model_version` — embeddings from different models are **not comparable**.
- Add a `UNIQUE` constraint on `(document_id, chunk_index)` to prevent duplicate chunks.
- **NEVER** compare embeddings from different models in the same table/query — distances become meaningless. You should have a column to tell which embedding model was used to generate a given embedding vector.
- **NEVER** store vectors as `REAL[]`, `FLOAT8[]`, or `JSONB` — you lose all pgvector indexing and operators.

### 9.4 Distance Functions and Operators

| Distance Metric | Operator | Index Ops Class | Use When |
|---|---|---|---|
| **Cosine distance** | `<=>` | `vector_cosine_ops` | Embeddings are normalized or you care about direction, not magnitude. **Default choice for text embeddings.** |
| **L2 (Euclidean) distance** | `<->` | `vector_l2_ops` | Embeddings represent spatial coordinates or magnitudes matter. |
| **Inner product** (negative) | `<#>` | `vector_ip_ops` | Embeddings are normalized and you want max similarity (dot product). Slightly faster than cosine. |
| **L1 (Manhattan) distance** | `<+>` (pgvector 0.7+) | `vector_l1_ops` | Rare — specific ML models that use L1. |
| **Hamming distance** | `<~>` (pgvector 0.7+) | `bit_hamming_ops` | Binary vectors / binary quantization. |
| **Jaccard distance** | `<%>` (pgvector 0.7+) | `bit_jaccard_ops` | Binary sparse vectors. |

> **Default recommendation**: Use **cosine distance (`<=>`)** for all text embedding models. Their output is typically normalized or near-normalized.

### 9.5 Indexing Strategies — HNSW vs IVFFlat

#### HNSW (Hierarchical Navigable Small World)

Example:
```sql
CREATE INDEX ...
  ON ...
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
```

| Parameter | Description | Guidance |
|---|---|---|
| `m` | Max connections per node per layer | Higher = better recall, more memory. `16` is good default. `32–48` for very high recall. |
| `ef_construction` | Search beam width during build | Higher = better index quality, slower build. `64–200`. Set to `2× m` as starting point. |
| `ef_search` (runtime) | Search beam width at query time | Set via `SET hnsw.ef_search = 100;`. Higher = better recall, slower. Default: `40`. |

#### IVFFlat (Inverted File with Flat Quantization)

Example:
```sql
CREATE INDEX ...
  ON ...
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 1000);
```

| Parameter | Description | Guidance |
|---|---|---|
| `lists` | Number of clusters (inverted lists) | `rows / 1000` for < 1M rows. `sqrt(rows)` for > 1M rows. |
| `probes` (runtime) | Number of lists to scan at query time | Set via `SET ivfflat.probes = 10;`. Higher = better recall, slower. Start at `sqrt(lists)`. |

#### HNSW vs IVFFlat Decision Matrix

| Characteristic | HNSW | IVFFlat |
|---|---|---|
| **Recall quality** | ⚡ Superior (~99%+ at reasonable settings) | Good (~95% with proper tuning) |
| **Query speed** | ⚡ Faster | Slightly slower |
| **Build speed** | Slower (2–10× IVFFlat) | ⚡ Faster |
| **Memory during build** | Higher | Lower |
| **Index size on disk** | Larger (1.5–2× IVFFlat) | Smaller |
| **Incremental inserts** | ✅ Handles well without degradation | ⚠️ Quality degrades — requires periodic `REINDEX` |
| **Requires training data** | ❌ No — works from row 0 | ⚠️ Yes — index quality is poor on < 1,000 rows per list |
| **Best for** | General use, < 10M vectors | Budget memory, fast rebuilds, static datasets |

> **Default recommendation:** Use **HNSW**. Only use IVFFlat if build time or memory during build is a hard constraint (e.g., very large datasets with frequent full rebuilds).

### 9.6 Query Patterns

#### Basic Semantic Search

- **ALWAYS** pass the query embedding as a parameterized vector, computed in the application layer.
- **ALWAYS** set `hnsw.ef_search` (or `ivfflat.probes`) explicitly before running the query for predictable recall.
- **ALWAYS** use `ORDER BY ... <=> LIMIT n` to trigger the ANN index. Without `ORDER BY + LIMIT`, pgvector falls back to sequential scan.

#### Filtered Vector Search (Metadata Pre-filtering)

**Important**: When combining `WHERE` filters with `ORDER BY <vector_op>`, PostgreSQL may struggle to use both the ANN index and the filter efficiently. For highly selective filters, the planner may choose a sequential scan.

**Mitigation strategies:**
- **Partial HNSW index** — if you always filter on a specific condition, define a `WHERE` clause when creating the index.
- **Partitioning** — partition the table by the filter column (e.g., by `model_name` or date range), each partition gets its own HNSW index.
- **Over-fetch and re-rank** — fetch more candidates (`LIMIT 200`) then re-filter in a CTE or application layer.

#### Hybrid Search: FTS + Vector (RAG Pattern)

Example combining keyword relevance with semantic similarity using RRF (Reciprocal Rank Fusion):
```sql
WITH fts_results AS (
  SELECT
    d.id AS document_id,
    row_number() OVER (ORDER BY ts_rank_cd(d.ts_content, fts_query, 32) DESC) AS fts_pos
  FROM documents AS d,
     websearch_to_tsquery('english', :user_query) AS fts_query
  WHERE d.ts_content @@ fts_query
  LIMIT 50
),
vector_results AS (
  SELECT
    de.document_id,
    row_number() OVER (ORDER BY de.embedding <=> :query_embedding) AS vec_pos
  FROM document_embeddings AS de
  ORDER BY de.embedding <=> :query_embedding
  LIMIT 50
),
fused AS (
  SELECT
    coalesce(f.document_id, v.document_id) AS document_id,
    -- Reciprocal Rank Fusion: RRF(d) = Σ 1/(k + rank_i)
    coalesce(1.0 / (60 + f.fts_pos), 0) + coalesce(1.0 / (60 + v.vec_pos), 0) AS rrf_score
  FROM fts_results AS f
  FULL OUTER JOIN vector_results AS v ON f.document_id = v.document_id
)
SELECT
  fu.document_id, fu.rrf_score, d.title, d.body
FROM fused AS fu
JOIN documents AS d ON d.id = fu.document_id
ORDER BY fu.rrf_score DESC
LIMIT 10;
```

> The constant `k = 60` in RRF is standard (from the original RRF paper). It controls how much rank position differences matter. No need to tune unless you have domain-specific requirements.

### 9.7 Halfvec and Quantization (pgvector 0.7+)

When possible, reduce memory and disk usage by using half-precision (float16):
```sql
ALTER TABLE ...
  ADD COLUMN ... halfvec(1536)
  GENERATED ALWAYS AS (embedding::halfvec) STORED;

CREATE INDEX ...
  ON ...
  USING hnsw (embedding_half halfvec_cosine_ops);
```

| Storage Format | Bytes per Dimension | 1536-dim Vector Size | Recall Impact |
|---|---|---|---|
| `vector` (float32) | 4 | ~6 KB | Baseline |
| `halfvec` (float16) | 2 | ~3 KB | Negligible (< 1% recall loss) |
| Binary quantization | 1/8 | ~192 B | Moderate — use for coarse first pass, re-rank with float32 |

### 9.8 Operational Guidelines

#### Embedding Generation
- Generate embeddings in the **application layer** (Python, Node.js), not inside PostgreSQL.
- Use batch API calls to the embedding provider (OpenAI, etc.) — typical batch size: 100–500 texts (it should be a setting).
- Store embeddings in a transaction with their source metadata.

#### Index Build and Maintenance
- **HNSW indexes are built in memory.** Ensure `maintenance_work_mem` is large enough:
  ```sql
  -- For building HNSW index on 1M × 1536-dim vectors:
  SET maintenance_work_mem = '4GB';  -- adjust based on table size
  CREATE INDEX CONCURRENTLY ix_doc_embeddings_hnsw ...;
  ```
- For IVFFlat: **always** build the index after the initial data load, not on an empty table. The clustering step needs representative data.
- Monitor index quality: if recall degrades after many inserts (IVFFlat), schedule a `REINDEX CONCURRENTLY`.

#### Dimension Reduction
- If your model supports it, use [Matryoshka embeddings](https://huggingface.co/blog/matryoshka) — truncate dimensions (e.g., 1536 → 102 or 512) for faster search with minor recall loss.
- **ALWAYS** re-normalize after truncation: `SELECT l2_normalize(embedding::halfvec(512))`.

### 9.9 pgvector Validation Checklist

- [ ] `vector` extension is created in the target database
- [ ] Column uses `halfvec(N)` with explicit dimension count
- [ ] Single embedding model per table (or strict `WHERE model_name = ...` filtering)
- [ ] HNSW index created with appropriate `m` and `ef_construction`
- [ ] `hnsw.ef_search` is set explicitly in application queries
- [ ] Queries use `ORDER BY <distance_op> LIMIT n` to trigger ANN index
- [ ] `maintenance_work_mem` is set appropriately for index builds
- [ ] Embedding generation is done in app layer, not via SQL functions
- [ ] a column identifies the model alongside every embedding vector
- [ ] Hybrid search uses RRF or similar fusion, not naive score addition

## 10. Migration & Change Management

### 10.1 Migration Rules

- Every schema change goes through a **versioned migration**.
- All migrations **MUST** be scripted in plain SQL scripts. 
- Migrations are **immutable** once merged to main branch — never edit a deployed migration.
- Every migration must have a corresponding **rollback script**.
- Migrations must be **idempotent** where possible (`IF NOT EXISTS`, `IF EXISTS`).

### 10.2 Zero-Downtime Migration Patterns

| Change | Safe Pattern |
|---|---|
| Add a column | Add as `NULL` first → backfill → add `NOT NULL` with `DEFAULT` |
| Drop a column | Remove from app code → deploy → drop column in next release |
| Rename a column | Add new column → copy data → update app → drop old column |
| Add an index | `CREATE INDEX CONCURRENTLY` (cannot be in a transaction block) |
| Drop a table | Remove all references → rename table → wait and check for absence of errors → drop |
| Change column type | Add new column → backfill → swap in app → drop old |

- **NEVER** run `CREATE INDEX` (non-concurrently) on a production table.
- **NEVER** add a `NOT NULL` constraint without a `DEFAULT` on an existing populated table in a single step.

### 10.3 Migration Review Requirements

Every migration PR must include:
1. The SQL migration script.
2. The rollback script.
3. Estimated impact: row count of affected tables, expected lock duration.
4. User sign-off for: table drops, type changes, new indexes on tables > 1M rows, new partitioning.

## 11. Security Practices

### 11.1 Access Control

- Application connects with a **dedicated, least-privilege role** — never `postgres` superuser.
- Separate roles for: read-only (reporting), read-write (application), admin (migrations).
- Use `GRANT` and `REVOKE` explicitly. Default to deny.

### 11.2 Data Protection

- Encrypt sensitive data at rest (PII, credentials) using `pgcrypto` or application-level encryption.
- Use column-level `SECURITY LABEL` or Row-Level Security (RLS) for multi-tenant applications.
- Mask sensitive data in non-production environments.
- **NEVER** store plaintext passwords — store only hashed values with a salt.
- **NEVER** log full query strings that contain sensitive parameters.

## 12. Validation Checklist

### 12.1 Pre-Commit Checklist

Before pushing any database-related code, verify:

- [ ] **Naming**: All objects follow Section 1 naming conventions
- [ ] **Types**: Column types follow Section 3 type rules
- [ ] **NOT NULL**: Every column is `NOT NULL` unless explicitly justified
- [ ] **Primary Key**: Table has `BIGINT GENERATED ALWAYS AS IDENTITY` PK
- [ ] **Foreign Keys**: All relationships have FK constraints with explicit actions
- [ ] **FK Indexes**: Every foreign key column is indexed
- [ ] **Constraints**: Business rules are enforced by `CHECK`/`UNIQUE`/`EXCLUDE` constraints
- [ ] **Audit columns**: `created_at` and `updated_at` present where required
- [ ] **Comments**: `COMMENT ON` present for table and non-obvious columns
- [ ] **No `SELECT *`**: All queries list columns explicitly
- [ ] **Parameterized**: All queries use parameterized inputs
- [ ] **Pagination**: Keyset pagination used for list endpoints
- [ ] **Migration is safe**: Follows zero-downtime patterns (Section 10.2)
- [ ] **Rollback exists**: Rollback migration is written and tested
- [ ] **Index CONCURRENTLY**: New indexes use `CONCURRENTLY`
- [ ] Transaction scope is minimal
- [ ] No N+1 query patterns
- [ ] Indexes justify their existence (tied to a known query)
- [ ] Migration is backward-compatible with current running application code
- [ ] Lock impact is assessed for large tables

## 13. Tooling & Automation

### 13.1 Required CI/CD Pipeline Steps

| Step | Tool(s) | Purpose |
|---|---|---|
| SQL Lint | `sqlfluff`, `squawk` | Enforce formatting, detect anti-patterns |
| Static query analysis | `squawk` | Catch `SELECT *`, missing indexes on FKs, unsafe migrations |
| Migration validation | `dbmate`, `sqitch`, `Liquibase Community` | Ensure migration chain integrity |
| EXPLAIN regression | Custom CI script | Run `EXPLAIN` on test DB, flag plan regressions |
| Security scan | `pg_audit`, CI secret scan | Detect hardcoded credentials, over-privileged roles |

### 13.2 Recommended `squawk` CI Configuration

[Squawk](https://squawkhq.com/) catches unsafe migration patterns automatically:

```yaml
# .squawk.toml
excluded_rules = []
```

### 13.3 Recommended Local Development Setup

```bash
# Use Docker for consistent local Postgres version
docker run -d \
  --name pg-local \
  -e POSTGRES_PASSWORD=localdev \
  -p 5432:5432 \
  pgvector/pgvector:pg18 \
  -c log_statement=all \
  -c log_min_duration_statement=100
```

> Note: Use the `pgvector/pgvector:pg18` Docker image instead of plain `postgres:18-alpine` to ensure the `vector` extension is available locally.

### 13.4 Recommended PostgreSQL Extensions

| Extension | Purpose |
|---|---|
| `pg_stat_statements` | Track query performance. |
| `vector` (pgvector) | Vector storage, ANN indexing, distance operators |
| `pg_trgm` | Trigram-based similarity search and `LIKE` optimization |
| `btree_gist` | Enable exclusion constraints on scalar types |
| `pgcrypto` | Cryptographic functions (`gen_random_uuid()`, encryption) |
| `citext` | Case-insensitive text (for email columns, etc.) |
