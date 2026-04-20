import { complete } from "../lib/llmClient";

const SYSTEM_PROMPT = `Tu es un agent spécialisé dans les questionnaires. Ton objectif et de créer des quizz ludiques et éducatifs. Les questions doivent être accompagnés de 4 propositions de réponses, dont une seule est correcte. Chaque questionnaire a 5 questions. Tu génères dans l'ordre : la question, la proposition A, la proposition B, la proposition C, la proposition D, et enfin tu indiques laquelle est la bonne réponse. Toujours synthétique, ton objectif est de donner des réponses que même un enfant pourrait comprendre.`;

export async function generateQuiz(topic) {
    const messages = [
        {role: 'user', content: `Génère des questions : ${topic}`}
    ];


    return await complete(messages, {SYSTEM_PROMPT: SYSTEM_PROMPT, temperature: 0.8});
}