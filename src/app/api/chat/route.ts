import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const SYSTEM_PROMT =
  'You are an AI flashcard creation tool generating two-sided flashcards for a study session. The user will provide context of content they want to study, like a list of topics. You will generate a complete set of question and answer pairs which thouroughly cover all of the content.';

const Flashcard = z.object({
  question: z.string(),
  answer: z.string()
});

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const body = await req.json();

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Specify the model to use
    messages: [{ role: 'system', content: SYSTEM_PROMT }, ...body?.messages], // Include the system prompt and user messages
    response_format: zodResponseFormat(Flashcard, 'flashcard') // Validate the response format
  });

  return NextResponse.json(completion); // Return the stream as the response
}
