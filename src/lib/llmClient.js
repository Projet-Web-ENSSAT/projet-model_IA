import OpenAI from "openai";

const client = new OpenAI({
    baseURL: import.meta.env.VITE_LLM_BASE_URL,
    apiKey: import.meta.env.VITE_LLM_API_KEY,
    dangerouslyAllowBrowser: true,
})

// Streaming
export async function streamCompletion(messages, onChunk, options={}){
    const stream = await client.chat.completions.create({
        model: import.meta.env.VITE_LLM_MODEL,
        messages: [{role: 'system', content: options.systemPrompt ?? 'You are a helpful assistant.'}, ...messages],
        stream: true,
    });

    let fullText = '';
    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        if (delta) fullText += delta; onChunk(delta);
    }
    return fullText;
}

// Non streaming
export async function complete(messages, options={}){
    const response = await client.chat.completions.create({
        model: import.meta.env.VITE_LLM_MODEL,
        messages: [{role: 'system', content: options.systemPrompt ?? 'You are a helpful assistant.'}, ...messages],
        stream: false,
    });
    return response.choices[0].message.content;
}