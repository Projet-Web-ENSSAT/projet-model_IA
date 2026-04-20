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

const btnStyle = (active) => ({
    padding: '8px 20px', background: active ? '#4a90e2' : '#ccc',
    color: 'white', border: 'none', borderRadius: '6px',
    cursor: active ? 'pointer' : 'default',
});

export default function Quiz({ raw }) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    if (!raw) return (
        <div style={{ padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px', color: '#999', textAlign: 'center' }}>
            Génère un quiz pour commencer
        </div>
    );

    const questions = parseQuiz(raw);
    if (questions.length === 0) return <pre style={{ whiteSpace: 'pre-wrap' }}>{raw}</pre>;

    if (finished) return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ fontSize: '1.4em', fontWeight: 'bold' }}>Quiz terminé !</p>
            <p style={{ fontSize: '1.1em' }}>Score : {score} / {questions.length}</p>
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
        <div>
            <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '0.5rem' }}>
                Question {current + 1} / {questions.length}
            </p>
            <Question
                question={q.question} choices={q.choices} answer={q.answer}
                selected={selected} confirmed={confirmed} onSelect={setSelected}
            />
            <div style={{ marginTop: '1rem' }}>
                {!confirmed
                    ? <button disabled={!selected} onClick={handleConfirm} style={btnStyle(!!selected)}>Valider</button>
                    : <button onClick={handleNext} style={btnStyle(true)}>{isLast ? 'Voir le score' : 'Question suivante'}</button>
                }
            </div>
        </div>
    );
}
