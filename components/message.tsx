'use client';
import { motion } from 'framer-motion';
import { memo, useMemo, useState } from 'react';
import type { Vote } from '@/lib/db/schema';
import { DocumentToolResult } from './document';
import { SparklesIcon } from './icons';
import { Response } from './elements/response';
import { MessageContent } from './elements/message';
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from './elements/tool';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import equal from 'fast-deep-equal';
import { cn, sanitizeText } from '@/lib/utils';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import { MessageReasoning } from './message-reasoning';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/types';
import { useDataStream } from './data-stream-provider';
import { useSession } from 'next-auth/react';
import { guestRegex } from '@/lib/constants';
import SupermemoryLogo from '@/public/images/Supermemory.svg';
import Image from 'next/image';
import { Bot, Dot } from 'lucide-react';
// import Stock from './Stock';

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding,
  isArtifactVisible,
}: {
  chatId: string;
  message: ChatMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>['setMessages'];
  regenerate: UseChatHelpers<ChatMessage>['regenerate'];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
  isArtifactVisible: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { data: session } = useSession();
  const isGuest = useMemo(
    () => guestRegex.test(session?.user?.email ?? ''),
    [session?.user?.email],
  );

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === 'file',
  );

  useDataStream();

  return (
    <motion.div
      data-testid={`message-${message.role}`}
      className="group/message w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cn('flex w-full items-start gap-2 md:gap-3', {
          'justify-end': message.role === 'user' && mode !== 'edit',
          'justify-start': message.role === 'assistant',
        })}
      >
        {message.role === 'assistant' && (
          <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-background ring-1 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div
          className={cn('flex flex-col', {
            'gap-2 md:gap-4': message.parts?.some(
              (p) => p.type === 'text' && p.text?.trim(),
            ),
            'min-h-96': message.role === 'assistant' && requiresScrollPadding,
            'w-full':
              (message.role === 'assistant' &&
                message.parts?.some(
                  (p) => p.type === 'text' && p.text?.trim(),
                )) ||
              mode === 'edit',
            'max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]':
              message.role === 'user' && mode !== 'edit',
          })}
        >
          {attachmentsFromMessage.length > 0 && (
            <div
              data-testid={`message-attachments`}
              className="flex flex-row justify-end gap-2"
            >
              {attachmentsFromMessage.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={{
                    name: attachment.filename ?? 'file',
                    contentType: attachment.mediaType,
                    url: attachment.url,
                  }}
                />
              ))}
            </div>
          )}

          {message.parts?.map((part, index) => {
            const { type } = part;
            const key = `message-${message.id}-part-${index}`;

            if (type === 'reasoning') {
              return (
                <MessageReasoning
                  key={key}
                  isLoading={isLoading}
                  reasoning={part.text ?? ''}
                />
              );
            }

            if (type === 'text') {
              if (mode === 'view') {
                return (
                  <div key={key}>
                    <MessageContent
                      data-testid="message-content"
                      className={cn({
                        'w-fit break-words rounded-md px-3 py-2 text-right text-white':
                          message.role === 'user',
                        'bg-transparent px-0 py-0 text-left':
                          message.role === 'assistant',
                      })}
                      style={
                        message.role === 'user'
                          ? { backgroundColor: '#d97706' }
                          : undefined
                      }
                    >
                      <Response>{sanitizeText(part.text)}</Response>
                    </MessageContent>
                  </div>
                );
              }

              if (mode === 'edit') {
                return (
                  <div
                    key={key}
                    className="flex w-full flex-row items-start gap-3"
                  >
                    <div className="size-8" />
                    <div className="min-w-0 flex-1">
                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        regenerate={regenerate}
                      />
                    </div>
                  </div>
                );
              }
            }

            if (type === 'tool-getWeather') {
              const { toolCallId, state } = part;

              return (
                <Tool key={toolCallId} defaultOpen={true}>
                  <ToolHeader type="tool-getWeather" state={state} />
                  <ToolContent>
                    {state === 'input-available' && (
                      <ToolInput input={part.input} />
                    )}
                    {state === 'output-error' && (
                      <ToolOutput
                        output={undefined}
                        errorText={part.errorText}
                      />
                    )}
                    {state === 'output-available' && (
                      <ToolOutput
                        output={<Weather weatherAtLocation={part.output} />}
                        errorText={undefined}
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }

            if (type === 'tool-createDocument') {
              const { toolCallId, state } = part;

              if (state === 'output-error') {
                return (
                  <Tool key={toolCallId} defaultOpen={true}>
                    <ToolHeader type="tool-createDocument" state={state} />
                    <ToolContent>
                      <ToolOutput
                        output={undefined}
                        errorText={part.errorText}
                      />
                    </ToolContent>
                  </Tool>
                );
              }

              return (
                <DocumentPreview
                  key={toolCallId}
                  chatId={chatId}
                  isReadonly={isReadonly}
                  result={part.output}
                />
              );
            }

            if (type === 'tool-updateDocument') {
              const { toolCallId, state } = part;

              if (state === 'output-error') {
                return (
                  <Tool key={toolCallId} defaultOpen={true}>
                    <ToolHeader type="tool-updateDocument" state={state} />
                    <ToolContent>
                      <ToolOutput
                        output={undefined}
                        errorText={part.errorText}
                      />
                    </ToolContent>
                  </Tool>
                );
              }

              return (
                <div key={toolCallId} className="relative">
                  <DocumentPreview
                    chatId={chatId}
                    isReadonly={isReadonly}
                    result={part.output}
                    args={{ ...part.output, isUpdate: true }}
                  />
                </div>
              );
            }

            if (type === 'tool-requestSuggestions') {
              const { toolCallId, state } = part;

              return (
                <Tool key={toolCallId} defaultOpen={true}>
                  <ToolHeader type="tool-requestSuggestions" state={state} />
                  <ToolContent>
                    {state === 'input-available' && (
                      <ToolInput input={part.input} />
                    )}
                    {state === 'output-error' && (
                      <ToolOutput
                        output={undefined}
                        errorText={part.errorText}
                      />
                    )}
                    {state === 'output-available' && (
                      <ToolOutput
                        output={
                          'error' in part.output ? (
                            <div className="rounded border p-2 text-red-500">
                              Error: {String(part.output.error)}
                            </div>
                          ) : (
                            <DocumentToolResult
                              type="request-suggestions"
                              result={part.output}
                              isReadonly={isReadonly}
                            />
                          )
                        }
                        errorText={undefined}
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }

            if (type === 'tool-addMemory') {
              const { toolCallId, state } = part;

              return (
                <Tool key={toolCallId} defaultOpen={true}>
                  <ToolHeader type="tool-addMemory" state={state} />
                  <ToolContent>
                    {state === 'input-available' && (
                      <ToolInput input={part.input} />
                    )}
                    {state === 'output-error' && (
                      <ToolOutput
                        output={undefined}
                        errorText={part.errorText}
                      />
                    )}
                    {state === 'output-available' && (
                      <ToolOutput
                        output={
                          isGuest ? (
                            <div className="rounded border p-2 text-red-500">
                              This feature is not available for guest users.
                            </div>
                          ) : (
                            <div className="space-y-2 p-3 text-sm">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-lg">
                                  <Bot className="mr-1 mb-1 inline-block" />
                                  Memory added
                                </div>
                                <Image
                                  src={SupermemoryLogo}
                                  alt="Supermemory Logo"
                                  width={150}
                                  height={30}
                                />
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {part.input.memory}
                              </div>
                            </div>
                          )
                        }
                        errorText={undefined}
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }

            if (type === 'tool-searchMemories') {
              const { toolCallId, state } = part;

              return (
                <Tool key={toolCallId} defaultOpen={true}>
                  <ToolHeader type="tool-searchMemories" state={state} />
                  <ToolContent>
                    {state === 'input-available' && (
                      <ToolInput input={part.input} />
                    )}
                    {state === 'output-error' && (
                      <ToolOutput
                        output={undefined}
                        errorText={part.errorText}
                      />
                    )}
                    {state === 'output-available' && (
                      <ToolOutput
                        output={
                          isGuest ? (
                            <div className="rounded border p-2 text-red-500">
                              This feature is not available for guest users.
                            </div>
                          ) : (
                            <div className="space-y-2 p-3 text-sm">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-lg">
                                  <Bot className="mr-2 mb-1 inline-block" />
                                  Memory found
                                </div>
                                <Image
                                  src={SupermemoryLogo}
                                  alt="Supermemory Logo"
                                  width={150}
                                  height={30}
                                />
                              </div>
                              <div className="whitespace-pre-wrap break-words text-muted-foreground text-xs">
                                {Array.isArray(part.output.results) &&
                                part.output.results.length > 0
                                  ? (
                                      part.output.results as {
                                        id?: string | number;
                                        content: string;
                                      }[]
                                    ).map((chunk, idx) => (
                                      <div
                                        key={String(chunk.id ?? idx)}
                                        className="mt-2"
                                      >
                                        <div className="truncate text-muted-foreground text-xs">
                                          <Dot className="mr-1 mb-1 inline-block" />
                                          {chunk.content}
                                        </div>
                                      </div>
                                    ))
                                  : 'No relevant memories found.'}
                              </div>
                            </div>
                          )
                        }
                        errorText={undefined}
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }

            // if (type === 'tool-stockTool') {
            //   const { toolCallId, state } = part;

            //   return (
            //     <Tool key={toolCallId} defaultOpen={true}>
            //       <ToolHeader type="tool-stockTool" state={state} />
            //       <ToolContent>
            //         {state === 'input-available' && (
            //           <ToolInput input={part.input} />
            //         )}
            //         {state === 'output-error' && (
            //           <ToolOutput
            //             output={undefined}
            //             errorText={part.errorText}
            //           />
            //         )}
            //         {state === 'output-available' && (
            //           <ToolOutput
            //             output={
            //               'price' in (part.output || {}) ? (
            //                 <Stock stockData={part.output as any} />
            //               ) : (
            //                 <div className="rounded border p-2 text-red-500 text-xs">
            //                   {String(
            //                     (part.output as any)?.error ||
            //                       'Unable to fetch stock data',
            //                   )}
            //                 </div>
            //               )
            //             }
            //             errorText={undefined}
            //           />
            //         )}
            //       </ToolContent>
            //     </Tool>
            //   );
            // }
          })}

          {!isReadonly && (
            <MessageActions
              key={`action-${message.id}`}
              chatId={chatId}
              message={message}
              vote={vote}
              isLoading={isLoading}
              setMode={setMode}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return false;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="group/message w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-role={role}
    >
      <div className="flex items-start justify-start gap-3">
        <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-background ring-1 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2 md:gap-4">
          <div className="p-0 text-muted-foreground text-sm">
            <LoadingText>Thinking…</LoadingText>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingText = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      animate={{ backgroundPosition: ['100% 50%', '-100% 50%'] }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      }}
      style={{
        background:
          'linear-gradient(90deg, hsl(var(--muted-foreground)) 0%, hsl(var(--muted-foreground)) 35%, hsl(var(--foreground)) 50%, hsl(var(--muted-foreground)) 65%, hsl(var(--muted-foreground)) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      }}
      className="flex items-center text-muted-foreground"
    >
      {children}
    </motion.div>
  );
};
