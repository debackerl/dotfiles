import { tool, type ToolContext } from "@opencode-ai/plugin";
import { Client, fetchExchange, gql } from "@urql/core";
import { retryExchange } from "@urql/exchange-retry";
import { encode } from "@toon-format/toon";

function createClient(space: string): Client {
  return new Client({
    url: `${process.env.FIBERY_BASE_URL}/api/graphql/space/${space}`,
    exchanges: [
      retryExchange({
        initialDelayMs: 1000,
        maxDelayMs: 5000,
        randomDelay: true,
        maxNumberAttempts: 3
      }),
      fetchExchange
    ],
    preferGetMethod: false,
    fetchOptions: () => {
      const token = process.env.FIBERY_API_TOKEN;
      return {
        headers: { authorization: token ? `Token ${token}` : '' },
      };
    },
  });
}

const psClient = createClient("Product_Strategy");
const pdClient = createClient("Product_Development");

function extractPublicId(urlOrId: string, expectedType: string): string {
  const match = urlOrId.trim().match(/^(?:https?:\/\/.+\/)?([^\/]+)\/(?:[^\/]+-)?(\d+)$/);
  if (!match) return urlOrId;

  if (match[1] !== expectedType) {
    throw new Error(`Expected a ${expectedType} URL or number as a public ID, but got a ${match[1]} URL.`);
  }

  return match[2];
}

function encodeObjectsArray(items: any[], emptyMessage: string): string {
  switch (items.length) {
    case 0: return emptyMessage;
    case 1: return encode(items[0]);
    default: return items.map((f, i) => encode(f)).join("\n\n---\n\n");
  }
}

// ========= products ============

const createProductMutation = gql`
  mutation($name: String!, $type: String!, $state: String!, $description: String!) {
    products {
      create(
        name: $name,
        type: { name: { is: $type } },
        state: { name: { is: $state } }
      ) {
        entities { id },
        message
      }
      overwriteDescription(value: $description) {
        message
      }
    }
  }
`;

export const create_product = tool({
  description: "Create a new Product in the portfolio. Description: structured elevator pitch, Markdown format. State: use `Idea` by default. Type: `Commercial` if we are going to sell it.",
  args: {
    name: tool.schema.string(),
    type: tool.schema.enum(["Commercial", "Internal"]),
    state: tool.schema.enum(["Idea", "Conception"]),
    description: tool.schema.string(),
  },
  async execute({ name, type, state, description }, context: ToolContext): Promise<string> {
    const { data: { products } } = await psClient.mutation(createProductMutation, { name, type, state, description });
    if (!products) return "Error.";
    const { id } = products.create.entities[0];

    const { data: { findProducts } } = await psClient.query(gql`query ($id: ID) { findProducts(id: { is: $id }) { publicId }}`, { id });
    return `Created Product/${findProducts[0].publicId}`;
  },
});


function updateProductMutation(args: {[key: string]: any}) {
  return gql`
    mutation($product_public_id: String!, ${args["name"]  ? ', name: String!'  : ''} ${args["type"]  ? ', $type: String!'  : ''} ${args["state"]  ? ', state: String!'  : ''} ${args["description"]  ? ',description: String!'  : ''}) {
      changes(publicId: { is: $product_public_id }) {
        update(
            product: { publicId: { is: $product_public_id } },
            ${args["name"] ? 'name: $name,' : ''}
            ${args["type"] ? 'type: { name: { is: $type } },' : ''}
            ${args["state"]  ? 'state: { name: { is: $state } },' : ''}
        ) { message }
        ${args["description"] ? 'overwriteDescription(value: $description) { message }' : ''}
      }
    }
  `;
}

export const update_product = tool({
  description: "Update a Product. Only provide modified fields and `product_public_id_or_url`.",
  args: {
    product_public_id_or_url: tool.schema.string(),
    name: tool.schema.string().optional(),
    type: tool.schema.enum(["Commercial", "Internal"]),
    state: tool.schema.enum(["Idea", "Conception", "Live"]),
    description: tool.schema.string().optional(),
  },
  async execute({ product_public_id_or_url, ...args }, context: ToolContext): Promise<string> {
    const product_public_id = extractPublicId(product_public_id_or_url, "Product");
    const { data: { products } } = await psClient.mutation(updateProductMutation(args), { product_public_id, ...args });
    if (!products) return "Product not found.";
    return `Product updated.`;
  },
});


const readProductsSummary = gql`
  query ($state: String!) {
    findProducts(state: {name: {is: $state}}) {
      publicId,
      name,
      type { name },
      state { name },
      description { md },
    }
  }
`;

export const read_products_summary = tool({
  description: "Get a summary of all Products of the portfolio.",
  args: {
    state: tool.schema.enum(["Idea", "Conception", "Live", "Ended"]),
  },
  async execute({ state }, context: ToolContext): Promise<string> {
    const { data: { findProducts } } = await psClient.query(readProductsSummary, { state });
    return encodeObjectsArray(findProducts, "Product not found.");
  },
});


const readProductQuery = gql`
  query ($public_id: String!) {
    findProducts(publicId: {is: $public_id}) {
      name,
      type { name },
      state { name },
      description { md },
    }
  }
`;

export const read_product = tool({
  description: "Read details about a Product of the portfolio. `public_id_or_url` is just a number or URL (fibery.io).",
  args: {
    public_id_or_url: tool.schema.string(),
  },
  async execute({ public_id_or_url }, context: ToolContext): Promise<string> {
    const public_id = extractPublicId(public_id_or_url, "Product");
    const { data: { findProducts } } = await psClient.query(readProductQuery, { public_id });
    return encodeObjectsArray(findProducts, "Product not found.");
  },
});

// ========= changes ============

const createChangeMutation = gql`
  mutation($product_public_id: String!, $name: String!, $type: String!, $description: String!) {
    changes {
      create(
        product: { publicId: { is: $product_public_id } },
        name: $name,
        type: { name: { is: $type } },
        state: { name: { is: "Backlog" } }
      ) {
        entities { id },
        message
      }
      overwriteDescription(value: $description) {
        message
      }
    }
  }
`;

export const create_change = tool({
  description: "Create a Change for a given Product. Description: structured, Markdown format with Mermaid blocks support. Type: A `Feature` brings positive business value, a `Fix` removes negative business value, a `Maintenance` removes future technical cost, and a `Refocus` deprecates Features to refocus resources and optimize business value in the longer term.",
  args: {
    product_public_id_or_url: tool.schema.string(),
    name: tool.schema.string(),
    type: tool.schema.enum(["Feature", "Fix", "Maintenance", "Refocus"]),
    description: tool.schema.string(),
  },
  async execute({ product_public_id_or_url, name, type, description }, context: ToolContext): Promise<string> {
    const product_public_id = extractPublicId(product_public_id_or_url, "Product");
    const { data: { changes } } = await pdClient.mutation(createChangeMutation, { product_public_id, name, type, description });
    if (!changes) return "Product not found.";
    const { id } = changes.create.entities[0];

    const { data: { findChanges } } = await pdClient.query(gql`query ($id: ID) { findChanges(id: { is: $id }) { publicId }}`, { id });
    return `Created Change/${findChanges[0].publicId}`;
  },
});


function updateChangeMutation(args: {[key: string]: any}) {
  return gql`
    mutation($change_public_id: String!, ${args["name"]  ? ', name: String!'  : ''} ${args["type"]  ? ', $type: String!'  : ''} ${args["state"]  ? ', state: String!'  : ''} ${args["description"]  ? ',description: String!'  : ''}) {
      changes(publicId: { is: $change_public_id }) {
        update(
            product: { publicId: { is: $change_public_id } },
            ${args["name"] ? 'name: $name,' : ''}
            ${args["type"] ? 'type: { name: { is: $type } },' : ''}
            ${args["state"]  ? 'state: { name: { is: $state } },' : ''}
        ) { message }
        ${args["description"] ? 'overwriteDescription(value: $description) { message }' : ''}
      }
    }
  `;
}

export const update_change = tool({
  description: "Update a Change. Only provide modified fields and `change_public_id_or_url`.",
  args: {
    change_public_id_or_url: tool.schema.string(),
    name: tool.schema.string().optional(),
    type: tool.schema.enum(["Feature", "Fix", "Maintenance", "Refocus"]).optional(),
    state: tool.schema.enum(["Backlog", "In Progress", "In Review"]).optional(), // only the User can switch to Completed or Abandoned, by using Fibery
    description: tool.schema.string().optional(),
  },
  async execute({ change_public_id_or_url, ...args }, context: ToolContext): Promise<string> {
    const change_public_id = extractPublicId(change_public_id_or_url, "Change");
    const { data: { changes } } = await pdClient.mutation(updateChangeMutation(args), { change_public_id, ...args });
    if (!changes.update) return "Change not found.";
    return `Change updated.`;
  },
});


const readChangesSummaryByState = gql`
  query ($product_public_id: String!, $state: String!) {
    findChanges(product: { publicId: { is: $product_public_id } }, state: { name: { is: $state } }) {
      publicId,
      type { name },
      state { name },
      name,
    }
  }
`;

export const read_changes_summary = tool({
  description: "Get a summary of all changes of a given product, in a certain state. `product_public_id_or_url` is just a number or URL (fibery.io).",
  args: {
    product_public_id_or_url: tool.schema.string(),
    state: tool.schema.enum(["Backlog", "In Progress", "In Review", "Completed", "Abandoned"]),
  },
  async execute({ product_public_id_or_url, state }, context: ToolContext): Promise<string> {
    const product_public_id = extractPublicId(product_public_id_or_url, "Product");
    const { data: { findChanges } } = await pdClient.query(readChangesSummaryByState, { product_public_id, state });
    return encodeObjectsArray(findChanges, "Change not found.");
  },
});


export const read_change = tool({
  description: "Get details of a Change. `change_public_id_or_url` is just a number or URL (fibery.io).",
  args: {
    change_public_id_or_url: tool.schema.string(),
    include_tasks: tool.schema.boolean().default(false),
    include_product: tool.schema.boolean().default(false),
  },
  async execute({ change_public_id_or_url, include_tasks, include_product }, context: ToolContext): Promise<string> {
    const change_public_id = extractPublicId(change_public_id_or_url, "Change");

    const readChangeQuery = gql`
      query ($change_public_id: String!) {
        findChanges(publicId: { is: $change_public_id }) {
          publicId,
          type { name },
          state { name },
          name,
          description { md },
          ${include_product ? `product {
            publicId,
            name,
            type { name } ,
            state { name },
            description { md }
          },` : ''}
          ${include_tasks ? `tasks {
            rank,
            publicId,
         	  name,
            type { name },
            state { name },
            severity { name },
            existingFiles,
          },` : ''}
        }
      }
    `;

    const { data: { findChanges } } = await pdClient.query(readChangeQuery, { change_public_id });
    return encodeObjectsArray(findChanges, "Change not found.");
  },
});

// ========= tasks ============

const addTaskMutation = gql`
  mutation($change_public_id: String!, $name: String!, $type: String!, $severity: String!, $existingFiles: String!, $description: String!) {
    tasks {
      create(
        rank: 0,
        change: { publicId: { is: $change_public_id } },
        name: $name,
        type: { name: { is: $type } },
        severity: { name: { is: $severity } },
        state: { name: { is: "Backlog" } },
        existingFiles: $existingFiles
      ) {
        entities { id },
        message
      }
      overwriteDescription(value: $description) {
        message
      }
    }
  }
`;

export const add_task = tool({
  description: "Add a new task to a given Change. Description: structured, Markdown format with Mermaid blocks support. Severity: The level of the danger if the task is not realized correctly, independently of the probability of this happening.",
  args: {
    change_public_id_or_url: tool.schema.string(),
    name: tool.schema.string(),
    type: tool.schema.enum(["Create", "Modify", "Refactor", "Delete", "Unit-test", "Docs", "Config"]),
    severity: tool.schema.enum(["Low", "Medium", "High"]),
    existing_files: tool.schema.array(tool.schema.string()).optional(),
    description: tool.schema.string(),
  },
  async execute({ change_public_id_or_url, name, type, severity, existing_files, description }, context: ToolContext): Promise<string> {
    const change_public_id = extractPublicId(change_public_id_or_url, "Change");

    let existing_files_str = "";
    if (existing_files) {
      existing_files_str = existing_files.map((name) => JSON.stringify(name)).join(", ");
    }

    const { data: { tasks } } = await pdClient.mutation(addTaskMutation, { change_public_id, name, type, severity, existingFiles: existing_files_str, description });
    if (!tasks) return "Change not found.";
    const { id } = tasks.create.entities[0];

    const { data: { findTasks } } = await pdClient.query(gql`query ($id: ID) { findTasks(id: { is: $id }) { publicId }}`, { id });
    return `Added Task/${findTasks[0].publicId}`;
  },
});


const rewriteTaskMutation = gql`
  mutation($task_public_id: String!, $name: String!, $type: String!, $severity: String!, $existingFiles: String!, $description: String!) {
    tasks(publicId: { is: $task_public_id }, state: { final: { is: false } }) {
      update(
        name: $name,
        type: { name: { is: $type } },
        severity: { name: { is: $severity } },
        state: { name: { is: "Backlog" } },
        existingFiles: $existingFiles
      ) {
        message
      }
      overwriteDescription(value: $description) {
        message
      }
    }
  }
`;

export const rewrite_task = tool({
  description: "Rewrite the content of an existing Task (only if not Completed or Abandoned yet), status to be reset to `Backlog`.",
  args: {
    task_public_id_or_url: tool.schema.string(),
    name: tool.schema.string(),
    type: tool.schema.enum(["Create", "Modify", "Refactor", "Delete", "Unit-test", "Docs", "Config"]),
    severity: tool.schema.enum(["Low", "Medium", "High"]),
    existing_files: tool.schema.array(tool.schema.string()).optional(),
    description: tool.schema.string(),
  },
  async execute({ task_public_id_or_url, name, type, severity, existing_files, description }, context: ToolContext): Promise<string> {
    const task_public_id = extractPublicId(task_public_id_or_url, "Task");

    let existing_files_str = "";
    if (existing_files) {
      existing_files_str = existing_files.map((name) => JSON.stringify(name)).join(", ");
    }

    const { data: { tasks } } = await pdClient.mutation(rewriteTaskMutation, { task_public_id, name, type, severity, existingFiles: existing_files_str, description });
    if (!tasks.update) return "Task not found.";
    return tasks.update.message + ". " + tasks.overwriteDescription.message;
  },
});


const updateTaskMutation = gql`
  mutation($task_public_id: String!, $state: String!, $comment: String!) {
    tasks(publicId: { is: $task_public_id }) {
      update(state: { name: { is: $state } }) {
        message
      }
      addComment(value: $comment) {
        message
      }
    }
  }
`;

export const update_task = tool({
  description: "Get the next tasks of a Change ready to implement.",
  args: {
    task_public_id_or_url: tool.schema.string(),
    state: tool.schema.enum(["Backlog", "In Progress", "In Review", "Completed", "Abandoned"]),
    comment: tool.schema.string(),
  },
  async execute({ task_public_id_or_url, state, comment }, context: ToolContext): Promise<string> {
    const task_public_id = extractPublicId(task_public_id_or_url, "Task");
    const { data: { tasks } } = await pdClient.mutation(updateTaskMutation, { task_public_id, state, comment: "Agent: " + comment });
    if (!tasks.update) return "Task not found.";
    return tasks.update.message + ". " + tasks.addComment.message;
  },
});


const getNextTaskQuery = gql`
  query ($change_public_id: String!) {
    findTasks(
      change: { publicId: { is: $change_public_id } },
      dependsOn: { id: { isNull: true } },
      state: { name: { is: "Backlog" } },
      orderBy: { rank: ASC },
      limit: 1
    ) {
      rank,
      publicId,
      type { name },
      state { name },
      severity { name },
      existingFiles,
      name,
      description { md },
    }
  }
`;

export const read_next_task = tool({
  description: "Get the next tasks of a Change ready to implement. `change_public_id_or_url` is just a number or URL (fibery.io).",
  args: {
    change_public_id_or_url: tool.schema.string(),
  },
  async execute({ change_public_id_or_url }, context: ToolContext): Promise<string> {
    const change_public_id = extractPublicId(change_public_id_or_url, "Change");
    const { data: { findTasks } } = await pdClient.query(getNextTaskQuery, { change_public_id });
    return encodeObjectsArray(findTasks, "Nothing to do.");
  },
});


const getTaskQuery = gql`
  query ($task_public_id: String!) {
    findTasks(publicId: { is: $task_public_id }) {
      rank,
      publicId,
      change { publicId },
      type { name },
      state { name },
      severity { name },
      existingFiles,
      name,
      description { md },
    }
  }
`;

export const read_task = tool({
  description: "Get the details of a Task. `task_public_id_or_url` is just a number or URL (fibery.io).",
  args: {
    task_public_id_or_url: tool.schema.string(),
  },
  async execute({ task_public_id_or_url }, context: ToolContext): Promise<string> {
    const task_public_id = extractPublicId(task_public_id_or_url, "Task");
    const { data: { findTasks } } = await pdClient.query(getTaskQuery, { task_public_id });
    return encodeObjectsArray(findTasks, "Task not found.");
  },
});
