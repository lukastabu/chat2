import { openai } from "@ai-sdk/openai";
import { streamText } from 'ai';
import  systemPrompt from "../systemPrompt";

export const maxDuration = 30

const prohibitedKeywords = ["malicious", "illegal", "violence", "hacking", "hate speech"];

const isValidInput = (messages: any) => {
    // Check if any messages contain prohibited keywords
    for (let message of messages) {
        if (message && typeof message.text === 'string') {
            for (let keyword of prohibitedKeywords) {
                if (message.text.toLowerCase().includes(keyword)) {
                    return false; // Input is invalid
                }
            }
        }
    }
    return true; // Input is valid
};

export async function POST(req: Request) {
    const { messages } = await req.json()
    
    // Security guard: validate input
    if (!isValidInput(messages)) {
        return new Response(JSON.stringify([{ role: "assistant", content: "Sorry, I can't help with that." }]), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


    const result = streamText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt(1),
        temperature: 0.8,
        maxTokens: 500,
        messages
    })

    return result.toDataStreamResponse();
}