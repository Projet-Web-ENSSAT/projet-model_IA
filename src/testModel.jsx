// src/App.jsx
import { useState } from 'react';
import { streamCompletion } from './lib/llmClient';

function App() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setResponse('');
    setLoading(true);

    await streamCompletion(
      [{ role: 'user', content: 'Dis juste "ça marche !" et rien d\'autre.' }],
      (delta) => setResponse(prev => prev + delta)
    );

    setLoading(false);
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <button onClick={handleTest} disabled={loading}>
        {loading ? 'En cours...' : 'Tester le LLM'}
      </button>
      <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{response}</p>
    </div>
  );
}

export default App;