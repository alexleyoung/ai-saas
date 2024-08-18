import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const SYSTEM_PROMT = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "question": "Front of the card",
      "answer": "Back of the card"
    }
  ]
}
`;

const Flashcard = z.object({
  question: z.string(),
  answer: z.string()
});

const Flashcards = z.object({ flashcards: z.array(Flashcard) });

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const body = await req.json();

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Specify the model to use
    messages: [{ role: 'system', content: SYSTEM_PROMT }, ...body?.messages],
    // Include the system prompt and user messages
    response_format: zodResponseFormat(Flashcards, 'flashcards') // Validate the response format
  });

  const flashcards_res = JSON.parse(
    completion.choices[0].message.content || '{}'
  );

  return NextResponse.json(flashcards_res); // Return the stream as the response
}
