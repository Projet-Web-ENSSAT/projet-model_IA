import { complete } from "../lib/llmClient";
import { getPlanetCacheContext } from "./planetAgent";

const SYSTEM_PROMPT = `Tu es un agent spécialisé dans les questionnaires. Ton objectif et de créer des quizz ludiques et éducatifs. Les questions doivent être accompagnés de 4 propositions de réponses, dont une seule est correcte. Chaque questionnaire a 5 questions. Tu génères dans l'ordre : la question, la proposition A, la proposition B, la proposition C, la proposition D, et enfin tu indiques laquelle est la bonne réponse. Toujours synthétique, ton objectif est de donner des réponses que même un enfant pourrait comprendre. Je veux une mise en forme avec un résultat pouvant être facilement parsé, idéalement en JSON.`;

export async function generateQuiz() {
    const planetContext = getPlanetCacheContext();

    if(planetContext) {
        const userContent = `Génère des questions sur les planètes vu par l'utilisateur, disponible dans le contexte. 5 questions au total et pas pour chaque planète.\n\nContexte disponible sur les planètes :\n${planetContext}`;

        const messages = [
            {role: 'user', content: userContent}
     ];

        return await complete(messages, {systemPrompt: SYSTEM_PROMPT, temperature: 0.8});
    } else {
        throw new Error('Aucun contexte disponible pour les planètes. Impossible de générer le quiz.');
    }  
}