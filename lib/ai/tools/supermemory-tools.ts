import { tool } from 'ai';
import { z } from 'zod';
import Supermemory from 'supermemory';

export function addMemoryTool(apiKey: string, opts: { projectId: string }) {
  const client = new Supermemory({ apiKey });
  const containerTags = [`sm_project_${opts.projectId}`];

  return tool({
    description:
      'Add (remember) memories/details/information about the user or other facts or entities. Run when explicitly asked or when the user mentions durable preferences/facts.',
    inputSchema: z.object({
      memory: z
        .string()
        .min(1)
        .describe('The text content of the memory to add.'),
    }),
    execute: async ({ memory }) => {
      const res = await client.memories.add({
        content: memory,
        containerTags,
      });
      return { success: true, memory: res } as const;
    },
  });
}

export function searchMemoriesTool(
  apiKey: string,
  opts: { projectId: string },
) {
  const client = new Supermemory({ apiKey });
  const containerTags = [`sm_project_${opts.projectId}`];

  return tool({
    description:
      'Search (recall) memories/details/information about the user or other facts. Use when context from past choices may help the answer.',
    inputSchema: z.object({
      informationToGet: z
        .string()
        .min(1)
        .describe("Terms to search for in the user's memories"),
      includeFullDocs: z
        .boolean()
        .optional()
        .default(true)
        .describe('Include full document content.'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .default(5)
        .describe('Maximum number of results to return'),
    }),
    execute: async ({
      informationToGet,
      includeFullDocs = true,
      limit = 5,
    }) => {
      const r = await client.search.execute({
        q: informationToGet,
        containerTags,
        limit,
        chunkThreshold: 0.6,
        includeFullDocs,
      } as any);

      return {
        success: true,
        results: r.results,
        count: r.results?.length ?? 0,
      } as const;
    },
  });
}
