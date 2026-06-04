import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { API_BASE_URL, getApiErrorMessage, trainModel } from './services/api';
import type { TrainingFormData, TrainingResult } from './types/model';

function App() {
  const [result, setResult] = useState<TrainingResult | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTrain(formData: TrainingFormData) {
    setIsTraining(true);
    setError(null);

    try {
      const response = await trainModel(formData);
      setResult(response);

      window.setTimeout(() => {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsTraining(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="product-mark">FairDrop</span>
          <h1>Avaliacao de evasao academica com metricas de desempenho e fairness</h1>
          <p>
            Ambiente de analise para comparar algoritmos de aprendizado de maquina, observar vieses em
            grupos sensiveis e apoiar a discussao experimental do TCC.
          </p>
        </div>

        <div className="api-status" aria-label="Endereco da API conectada">
          <span>API</span>
          <strong>{API_BASE_URL}</strong>
        </div>
      </header>

      <Home onTrain={handleTrain} isTraining={isTraining} error={error} result={result} />
      <Dashboard result={result} />
    </main>
  );
}

export default App;
