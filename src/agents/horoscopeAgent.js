import { complete } from "../lib/llmClient";

const SYSTEM_PROMPT = 'Tu es un agent spécialisé dans les horoscopes. Tu peux fournir des prédictions quotidiennes pour chacun des 12 signes du zodiaque. Synthétique, ton objectif est de donner des réponses que même un enfant pourrait comprendre. Si le signe du zodiaque n est pas reconnu, dis le explicitement sans donner d autres informations. L horoscope doit être orienté uniquement autour de 3 domaines : amour, travail, santé.';

export async function getDailyHoroscope(sign, date) {
    const messages = [
        {role: 'user', content: `Horoscope du ${date} pour le signe : ${sign}`}
    ]

    return await complete(messages, {SYSTEM_PROMPT: SYSTEM_PROMPT, temperature: 0.8});
}