import { complete } from "../lib/llmClient";

const SYSTEM_PROMPT = `Tu es un agent spécialisé dans les planètes du système solaire. 
Tu peux fournir des descriptions, anecdotes, caractéristiques. 
Toujours synthétique, ton objectif est de donner des réponses que même un enfant pourrait comprendre. 
Si tu ne connais pas la planète demandée, dis le explicitement. 
Si la planète n'est pas dans le système solaire, dis le, sans donner d'autres informations.`;

export async function getPlanetDescription(planetName) {
    const messages = [
        {role: 'user', content: `Donne 3 caractéristiques sur : ${planetName}`}
    ]

    return await complete(messages, {SYSTEM_PROMPT: SYSTEM_PROMPT, temperature: 0.8});
}

export async function getPlanetAnecdote(planetName) {
    const messages = [
        {role: 'user', content: `Donne une anecdote intéressante sur : ${planetName}`}
    ]

    return await complete(messages, {SYSTEM_PROMPT: SYSTEM_PROMPT, temperature: 0.8});
}