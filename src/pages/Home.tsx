import UploadData from './UploadData';
import type { TrainingFormData, TrainingResult } from '../types/model';

type HomeProps = {
  onTrain: (data: TrainingFormData) => Promise<void>;
  isTraining: boolean;
  error: string | null;
  result: TrainingResult | null;
};

function formatModelName(model: string) {
  const names: Record<string, string> = {
    logistic: 'Regressao Logistica',
    rf: 'Random Forest',
    knn: 'KNN',
    xgboost: 'XGBoost',
    xgb: 'XGBoost',
  };

  return names[model] ?? model;
}

export default function Home({ onTrain, isTraining, error, result }: HomeProps) {
  return (
    <section className="workspace-grid" aria-label="Configuracao da analise">
      <UploadData onTrain={onTrain} isTraining={isTraining} error={error} />

      <aside className="research-panel">
        <div className="panel-block">
          <span className="section-kicker">Experimento</span>
          <h2>Pipeline preparado para avaliacao academica</h2>
          <p>
            O frontend envia o CSV, a coluna alvo, o atributo sensivel e o algoritmo escolhido para o endpoint
            de treinamento. A resposta alimenta automaticamente os graficos de desempenho, matriz de confusao,
            fairness e importancia de variaveis.
          </p>
        </div>

        <div className="pipeline-list" aria-label="Etapas do experimento">
          <div className="pipeline-item is-active">
            <span>01</span>
            <strong>Dataset</strong>
            <p>Leitura do CSV e selecao das colunas de estudo.</p>
          </div>
          <div className="pipeline-item is-active">
            <span>02</span>
            <strong>Modelo</strong>
            <p>Treinamento supervisionado para prever evasao.</p>
          </div>
          <div className="pipeline-item">
            <span>03</span>
            <strong>Fairness</strong>
            <p>Calculo das metricas para grupos privilegiados e nao privilegiados.</p>
          </div>
          <div className="pipeline-item">
            <span>04</span>
            <strong>Analise</strong>
            <p>Leitura visual dos resultados para comparacao no TCC.</p>
          </div>
        </div>

        {result ? (
          <div className="last-run-card">
            <span className="section-kicker">Ultima analise</span>
            <strong>{formatModelName(result.modelo)}</strong>
            <div className="last-run-grid">
              <span>{result.dataset.linhas_apos_limpeza} registros validos</span>
              <span>{(result.metricas.accuracy * 100).toFixed(1)}% acuracia</span>
            </div>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
