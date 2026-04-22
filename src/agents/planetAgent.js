import { complete } from "../lib/llmClient";

const SYSTEM_PROMPT = `Tu es un agent spécialisé dans les planètes du système solaire. 
Tu peux fournir des descriptions, anecdotes, caractéristiques. 
Toujours synthétique, ton objectif est de donner des réponses que même un enfant pourrait comprendre.
Réponds en texte brut uniquement : pas d'étoiles (*), pas de gras, pas d'italique, pas de titres (#)`;

const cache = new Map();

export async function getPlanetDescription(planetName) {
    if(cache.has('description_' + planetName)) return cache.get('description_' + planetName);
    
    const messages = [
        {role: 'user', content: `Donne 3 caractéristiques sur : ${planetName}`}
    ]

    const response = await complete(messages, {SYSTEM_PROMPT: SYSTEM_PROMPT, temperature: 0.8});
    cache.set('description_' + planetName, response);
    return response;
}

export function getPlanetCacheContext() {
    if (cache.size === 0) return null;

    return [...cache.entries()]
        .map(([key, value]) => `[${key}]\n${value}`)
        .join('\n\n');
}

export async function getPlanetAnecdote(planetName) {
    if (cache.has('anecdote_' + planetName)) return cache.get('anecdote_' + planetName);


    const messages = [
        {role: 'user', content: `Donne une anecdote intéressante sur : ${planetName}`}
    ]

    const response = await complete(messages, {SYSTEM_PROMPT: SYSTEM_PROMPT, temperature: 0.8});
    cache.set('anecdote_' + planetName, response);
    return response;
}