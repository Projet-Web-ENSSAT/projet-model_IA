import { useState } from 'react';
import Question from './Question';

function parseQuiz(raw) {
    const stripped = raw.replace(/```(?:json)?\s*([\s\S]*?)```/i, '$1').trim();
    try {
        const items = JSON.parse(stripped);
        if (!Array.isArray(items)) return [];
        return items
            .filter(q => q.question && q.choices?.A && q.choices?.B && q.choices?.C && q.choices?.D && q.answer)
            .map(q => ({ question: q.question, choices: q.choices, answer: q.answer.toUpperCase() }));
    } catch {
        return [];
    }
}

export default function Quiz({ raw }) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    if (!raw) return null;

    const questions = parseQuiz(raw);
    if (questions.length === 0) return null;

    if (finished) return (
        <div className="quiz-score">
            <p className="quiz-score-title">Quiz terminé !</p>
            <p className="quiz-score-result">Score : {score} / {questions.length}</p>
        </div>
    );

    const q = questions[current];
    const isLast = current + 1 >= questions.length;

    function handleConfirm() {
        if (selected === q.answer) setScore(s => s + 1);
        setConfirmed(true);
    }

    function handleNext() {
        if (isLast) { setFinished(true); return; }
        setCurrent(c => c + 1);
        setSelected(null);
        setConfirmed(false);
    }

    return (
        <div className="quiz-body">
            <p className="quiz-progress">Question {current + 1} / {questions.length}</p>
            <Question
                question={q.question}
                choices={q.choices}
                answer={q.answer}
                selected={selected}
                confirmed={confirmed}
                onSelect={setSelected}
            />
            <div className="quiz-actions">
                {!confirmed
                    ? <button className={`quiz-btn${selected ? ' quiz-btn--active' : ''}`} disabled={!selected} onClick={handleConfirm}>Valider</button>
                    : <button className="quiz-btn quiz-btn--active" onClick={handleNext}>{isLast ? 'Voir le score' : 'Question suivante'}</button>
                }
            </div>
        </div>
    );
}
