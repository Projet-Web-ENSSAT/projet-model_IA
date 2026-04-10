import { complete } from "../lib/llmClient";

const SYSTEM_PROMPT = ''

export async function getDailyHoroscope(sign, date) {
    const messages = [
        {role: 'user', content: `Horoscope du ${date} pour le signe : ${sign}`}
    ]

    return await complete(messages, {SYSTEM_PROMPT: SYSTEM_PROMPT, temperature: 0.8});
}