import { NextRequest, NextResponse } from 'next/server';
import { createChatStream } from '@/lib/claude';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages?.length) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
    }

    const stream = createChatStream(messages);
    const readable = stream.toReadableStream();

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
