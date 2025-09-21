import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialVisibilityType="private"
          isReadonly={false}
          session={session}
          autoResume={false}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={modelIdFromCookie.value}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
      />
      <DataStreamHandler />
    </>
  );
}

export const metadata: Metadata = {
  title: 'New Chat',
  description:
    'Start a new conversation. Chat with AI, attach images or PDFs, and generate artifacts.',
  openGraph: {
    title: 'New Chat',
    description:
      'Start a new conversation. Chat with AI, attach images or PDFs, and generate artifacts.',
    images: ['/images/demo-thumbnail.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Chat',
    description:
      'Start a new conversation. Chat with AI, attach images or PDFs, and generate artifacts.',
    images: ['/images/demo-thumbnail.png'],
  },
};
