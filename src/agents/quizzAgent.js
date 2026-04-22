import { complete } from "../lib/llmClient";
import { clearPlanetCacheContext, getPlanetCacheContext } from "./planetAgent";

const SYSTEM_PROMPT = `Tu es un agent spécialisé dans les questionnaires ludiques et éducatifs pour enfants.
Tu réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après, sans balises markdown.
Chaque élément du tableau a exactement cette structure :
{"question":"...","choices":{"A":"...","B":"...","C":"...","D":"..."},"answer":"A"}
La valeur de "answer" est toujours une seule lettre majuscule parmi A, B, C ou D.`;

export async function generateQuiz() {
    const planetContext = getPlanetCacheContext();

    if(planetContext) {
        const userContent = `Génère des questions sur les planètes vu par l'utilisateur, disponible dans le contexte. 5 questions au total et pas pour chaque planète.\n\nContexte disponible sur les planètes :\n${planetContext}`;

        const messages = [
            {role: 'user', content: userContent}
        ];

        const responses = await complete(messages, {systemPrompt: SYSTEM_PROMPT, temperature: 0.8});
        clearPlanetCacheContext();

        return responses;
    } else {
        throw new Error('Aucun contexte disponible pour les planètes. Impossible de générer le quiz.');
    }  
}