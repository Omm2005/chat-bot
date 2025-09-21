import { z } from 'zod';
import type getWeather from './ai/tools/get-weather';
import type { createDocument } from './ai/tools/create-document';
import type { updateDocument } from './ai/tools/update-document';
import type { requestSuggestions } from './ai/tools/request-suggestions';
import type { InferUITool, UIMessage } from 'ai';
import type { AppUsage } from './usage';
import type { ArtifactKind } from '@/components/artifact';
import type { Suggestion } from './db/schema';
import type { StockData } from './ai/tools/getStock';
// Note: Supermemory tool types are defined inline for UI compatibility.

export type DataPart = { type: 'append-message'; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type requestSuggestionsTool = InferUITool<
  ReturnType<typeof requestSuggestions>
>;

// Supermemory tool UI types (compatible with current AI SDK)
type addMemoryToolType = {
  input: { memory: string };
  output: { success: boolean; memory?: unknown; error?: string };
};
type searchMemoriesToolType = {
  input: {
    informationToGet: string;
    includeFullDocs?: boolean;
    limit?: number;
  };
  output: {
    success: boolean;
    results?: unknown[];
    count?: number;
    error?: string;
  };
};

type stockToolType = {
  input: { symbol: string };
  output: StockData | { error?: string };
};

export type ChatTools = {
  getWeather: weatherTool;
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  requestSuggestions: requestSuggestionsTool;
  addMemory: addMemoryToolType;
  searchMemories: searchMemoriesToolType;
  stockTool: stockToolType;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
  usage: AppUsage;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}
