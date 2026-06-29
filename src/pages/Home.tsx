import UploadData from '../Components/Upload/UploadCSV';
import type { AnalyzeResult, TrainingFormData, TrainingResult } from '../types/model';
import { formatModelName } from '../types/model';

type HomeProps = {
  analysis: AnalyzeResult | null;
  onAnalyze: (file: File) => Promise<void>;
  onTrain: (data: TrainingFormData) => Promise<void>;
  isAnalyzing: boolean;
  isTraining: boolean;
  error: string | null;
  result: TrainingResult | null;
};

export default function Home({
  analysis,
  onAnalyze,
  onTrain,
  isAnalyzing,
  isTraining,
  error,
  result,
}: HomeProps) {
  const bestAccuracy = result?.comparativo_modelos.melhor_acuracia;
  const bestFairness = result?.comparativo_modelos.melhor_fairness;

  return (
    <section className="workspace-grid" aria-label="Configuração da análise">
      <UploadData
        analysis={analysis}
        onAnalyze={onAnalyze}
        onTrain={onTrain}
        isAnalyzing={isAnalyzing}
        isTraining={isTraining}
        error={error}
      />

      <aside className="research-panel">
        <div className="panel-block">
          <span className="section-kicker">Experimento</span>
          <h2>Pipeline guiado para comparar performance e fairness</h2>
          <p>
            Primeiro o backend lê o CSV e sugere colunas candidatas para target e sensitive. Depois do ajuste
            do usuário, os quatro modelos são treinados automaticamente para facilitar a comparação final.
          </p>
        </div>

        <div className="pipeline-list" aria-label="Etapas do experimento">
          <div className={analysis ? 'pipeline-item is-active' : 'pipeline-item'}>
            <span>01</span>
            <strong>Leitura do dataset</strong>
            <p>Upload do CSV com diagnóstico inicial da quantidade de linhas, colunas e problemas detectados.</p>
          </div>
          <div className={analysis ? 'pipeline-item is-active' : 'pipeline-item'}>
            <span>02</span>
            <strong>Recomendação assistida</strong>
            <p>O sistema sugere target e sensitive com base no nome das colunas e nos padrões dos valores.</p>
          </div>
          <div className={result ? 'pipeline-item is-active' : 'pipeline-item'}>
            <span>03</span>
            <strong>Pré-processamento</strong>
            <p>Limpeza, binarização, imputação e preparação das features antes da divisão treino e teste.</p>
          </div>
          <div className={result ? 'pipeline-item is-active' : 'pipeline-item'}>
            <span>04</span>
            <strong>Treino dos 4 modelos</strong>
            <p>Logistic Regression, Random Forest, KNN e XGBoost são executados no mesmo conjunto.</p>
          </div>
          <div className={result ? 'pipeline-item is-active' : 'pipeline-item'}>
            <span>05</span>
            <strong>Leitura crítica</strong>
            <p>O dashboard mostra quem foi mais preciso, quem foi mais justo e onde o fairness exige atenção.</p>
          </div>
        </div>

        {result ? (
          <div className="last-run-card">
            <span className="section-kicker">Última análise</span>
            <strong>{formatModelName(result.modelo_principal.tipo)}</strong>
            <div className="last-run-grid">
              <span>{result.dataset.linhas_finais} registros prontos para modelagem</span>
              <span>{(result.metricas.accuracy * 100).toFixed(1)}% de acurácia no modelo principal</span>
              <span>
                Melhor acurácia: {bestAccuracy ? `${bestAccuracy.nome} (${(bestAccuracy.valor * 100).toFixed(1)}%)` : 'N/A'}
              </span>
              <span>
                Melhor fairness: {bestFairness ? `${bestFairness.nome} (${(bestFairness.valor * 100).toFixed(1)}%)` : 'N/A'}
              </span>
            </div>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
