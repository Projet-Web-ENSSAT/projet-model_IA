export default function Question({ question, choices, answer, selected, confirmed, onSelect }) {
    function getChoiceClass(letter) {
        if (confirmed && letter === answer) return 'choice-btn choice-btn--correct';
        if (confirmed && letter === selected) return 'choice-btn choice-btn--wrong';
        if (!confirmed && letter === selected) return 'choice-btn choice-btn--selected';
        return 'choice-btn';
    }

    return (
        <div className="question">
            <p className="question-text">{question}</p>
            <div className="question-choices">
                {Object.entries(choices).map(([letter, text]) => (
                    <button
                        key={letter}
                        className={getChoiceClass(letter)}
                        disabled={confirmed}
                        onClick={() => onSelect(letter)}
                    >
                        <strong>{letter}.</strong> {text}
                    </button>
                ))}
            </div>
            {confirmed && selected !== answer && (
                <p className="choice-correct-hint">
                    Bonne réponse : {answer}. {choices[answer]}
                </p>
            )}
        </div>
    );
}
