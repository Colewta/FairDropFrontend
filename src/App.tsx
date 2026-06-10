import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { getApiErrorMessage, trainModel } from './services/api';
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
    }
    catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
    finally {
      setIsTraining(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="product-mark">FairDrop</span>
          <h1>Avaliação de equidade de algoritmo (Fairness)</h1>
        </div>
      </header>

      <Home onTrain={handleTrain} isTraining={isTraining} error={error} result={result} />
      <Dashboard result={result} />
    </main>
  );
}

export default App;
