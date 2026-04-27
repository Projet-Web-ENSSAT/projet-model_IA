import { useState } from 'react';
import { getPlanetDescription, getPlanetAnecdote } from './agents/planetAgent';
import { getDailyHoroscope } from './agents/horoscopeAgent';
import { generateQuiz } from './agents/quizzAgent';
import Quiz from './components/Quiz';

function App() {
  const [planet, setPlanet] = useState('');
  const [sign, setSign] = useState('');
  const [planetResult, setPlanetResult] = useState('');
  const [horoResult, setHoroResult] = useState('');
  const [quizResult, setQuizResult] = useState('');
  const [quizError, setQuizError] = useState('');

  const today = new Date().toLocaleDateString('fr-FR');

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px' }}>

      <h2>🪐 Anecdote planète</h2>
      <input
        placeholder="Caractéristique"
        value={planet}
        onChange={e => setPlanet(e.target.value)}
      />
      <button onClick={async () => {
        setPlanetResult('...');
        setPlanetResult(await getPlanetDescription(planet));
      }}>
        Générer
      </button>

      <input
        placeholder="Anecdote"
        value={planet}
        onChange={e => setPlanet(e.target.value)}
      />
      <button onClick={async () => {
        setPlanetResult('...');
        setPlanetResult(await getPlanetAnecdote(planet));
      }}>
        Générer
      </button>
      <p>{planetResult}</p>

      <hr />

      <h2>🔮 Horoscope du jour</h2>
      <input
        placeholder="Ex: Bélier, Taureau, Gémeaux..."
        value={sign}
        onChange={e => setSign(e.target.value)}
      />
      <button onClick={async () => {
        setHoroResult('...');
        setHoroResult(await getDailyHoroscope(sign, today));
      }}>
        Générer
      </button>
      <p>{horoResult}</p>

      <hr />

      <h2>❓ Quiz planètes</h2>
      <button onClick={async () => {
        setQuizResult('...');
        setQuizError('');
        try {
          setQuizResult(await generateQuiz());
        } catch (e) {
          setQuizResult('');
          setQuizError(e.message);
        }
      }}>
        Générer
      </button>
      {quizError && <p style={{ color: 'red' }}>{quizError}</p>}
      <Quiz key={quizResult} raw={quizResult && quizResult !== '...' ? quizResult : null} />

    </div>
  );
}

export default App;