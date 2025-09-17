import { tool as createTool } from 'ai';
import { z } from 'zod';
import 'dotenv/config';
import Supermemory from 'supermemory';

const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY,
});

export const addMemory = ({
  projectId,
  memoryContent,
}: { projectId: string; memoryContent: string }) =>
  createTool({
    description:
      'Add (remember) memories/details/information about the user or other facts or entities. Run when explicitly asked or when the user mentions any information generalizable beyond the context of the current conversation.',
    inputSchema: z.object({
      projectId: z.string(),
      memoryContent: z.string(),
    }),
    execute: async ({ projectId }) => {
      if (!process.env.SUPERMEMORY_API_KEY) {
        throw new Error('Supermemory Api key missing');
      }
    },
  });
