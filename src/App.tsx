import { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { analyzeDataset, getApiErrorMessage, trainModel } from './services/api';
import type { AnalyzeResult, TrainingFormData, TrainingResult } from './types/model';

function App() {
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [result, setResult] = useState<TrainingResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(file: File) {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeDataset(file);
      setAnalysis(response);
    }
    catch (requestError) {
      setAnalysis(null);
      setError(getApiErrorMessage(requestError));
      throw requestError;
    }
    finally {
      setIsAnalyzing(false);
    }
  }

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
        <div className="hero-copy">
          <span className="product-mark">FairDrop</span>
          <h1>Avaliação de equidade de algoritmo</h1>
          <p>
            Envie a base, receba recomendações automáticas de target e sensitive, ajuste o que for necessário
            e compare desempenho preditivo e fairness entre Logistic Regression, Random Forest, KNN e XGBoost.
          </p>
        </div>
        <div className="hero-panel" aria-hidden="true">
          <span className="hero-panel-label">Pipeline</span>
          <strong>Análise guiada do dataset até o comparativo dos modelos</strong>
          <p>O fluxo agora separa diagnóstico da base, escolhas assistidas e leitura amigável dos riscos de fairness.</p>
        </div>
      </header>

      <Home
        analysis={analysis}
        onAnalyze={handleAnalyze}
        onTrain={handleTrain}
        isAnalyzing={isAnalyzing}
        isTraining={isTraining}
        error={error}
        result={result}
      />
      <Dashboard result={result} />
    </main>
  );
}

export default App;
