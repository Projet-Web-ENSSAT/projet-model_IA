export default function Question({ question, choices, answer, selected, confirmed, onSelect }) {
    function getStyle(letter) {
        if (confirmed && letter === answer) return { bg: '#d4edda', border: '1px solid #28a745' };
        if (confirmed && letter === selected) return { bg: '#f8d7da', border: '1px solid #dc3545' };
        if (!confirmed && letter === selected) return { bg: '#e8f0fe', border: '1px solid #4a90e2' };
        return { bg: 'transparent', border: '1px solid #ccc' };
    }

    return (
        <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>{question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.entries(choices).map(([letter, text]) => {
                    const { bg, border } = getStyle(letter);
                    return (
                        <button
                            key={letter}
                            disabled={confirmed}
                            onClick={() => onSelect(letter)}
                            style={{ textAlign: 'left', padding: '6px 12px', background: bg, border, borderRadius: '6px', cursor: confirmed ? 'default' : 'pointer' }}
                        >
                            <strong>{letter}.</strong> {text}
                        </button>
                    );
                })}
            </div>
            {confirmed && selected !== answer && (
                <p style={{ color: '#721c24', fontSize: '0.9em', marginTop: '0.5rem' }}>
                    Bonne réponse : {answer}. {choices[answer]}
                </p>
            )}
        </div>
    );
}
