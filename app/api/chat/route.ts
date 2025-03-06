import { openai } from "@ai-sdk/openai";
import { streamText } from 'ai';
import  systemPrompt from "../systemPrompt";

export const maxDuration = 30

export async function POST(req: Request) {
    const { messages } = await req.json()
    
    const result = streamText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt(1),
        messages
    })

    return result.toDataStreamResponse();
}