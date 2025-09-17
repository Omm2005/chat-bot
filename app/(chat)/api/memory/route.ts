import { auth } from '@/app/(auth)/auth';
import { ChatSDKError } from '@/lib/errors';
import Supermemory from 'supermemory';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return new ChatSDKError('unauthorized:api').toResponse();
    if (session.user.type === 'guest')
      return new ChatSDKError('forbidden:auth').toResponse();

    const { memory } = (await request.json()) as { memory?: string };
    if (!memory || typeof memory !== 'string' || memory.trim().length === 0)
      return new ChatSDKError('bad_request:api').toResponse();

    if (!process.env.SUPERMEMORY_API_KEY)
      return new ChatSDKError('offline:api', 'Missing Supermemory API key').toResponse();

    const client = new Supermemory({ apiKey: process.env.SUPERMEMORY_API_KEY });
    const containerTags = [`sm_project_${session.user.id}`];

    const result = await client.memories.add({ content: memory, containerTags });

    return Response.json({ success: true, memory: result }, { status: 200 });
  } catch (err: any) {
    console.error('Memory add failed', err);
    return new ChatSDKError('offline:api', err?.message || 'Memory add failed').toResponse();
  }
}

