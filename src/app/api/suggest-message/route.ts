import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

    // Using streamText instead of OpenAIStream
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [{ role: 'user', content: prompt }],
    });

    // Return streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
