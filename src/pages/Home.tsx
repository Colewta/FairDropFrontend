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
    logistic: 'Regressão Logística',
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
          <h2>Pipeline preparado para avaliação acadêmica</h2>
          <p>
            O usuário envia o CSV, a coluna alvo, o atributo sensível e o algoritmo escolhido para a execução
            do treinamento. A resposta alimenta automaticamente os gráficos de desempenho, matriz de confusão,
            fairness e importância de variáveis.
          </p>
        </div>

        <div className="pipeline-list" aria-label="Etapas do experimento">
          <div className="pipeline-item is-active">
            <span>01</span>
            <strong>Dataset</strong>
            <p>Leitura do CSV e seleção das colunas de estudo.</p>
          </div>
          <div className="pipeline-item is-active">
            <span>02</span>
            <strong>Pré-processamento</strong>
            <p>Limpeza dos dados para remoção de duplicidades e outros problemas.</p>
          </div>
          <div className="pipeline-item is-active">
            <span>03</span>
            <strong>Modelo</strong>
            <p>Treinamento supervisionado para prever evasão.</p>
          </div>
          <div className="pipeline-item">
            <span>04</span>
            <strong>Fairness</strong>
            <p>Cálculo das métricas para grupos privilegiados e não privilegiados.</p>
          </div>
          <div className="pipeline-item">
            <span>05</span>
            <strong>Análise</strong>
            <p>Leitura visual dos resultados para comparação das métricas.</p>
          </div>
        </div>

        {result ? (
          <div className="last-run-card">
            <span className="section-kicker">Última análise</span>
            <strong>{formatModelName(result.modelo)}</strong>
            <div className="last-run-grid">
              <span>{result.dataset.linhas_apos_limpeza} registros válidos</span>
              <span>{(result.metricas.accuracy * 100).toFixed(1)}% acurácia</span>
            </div>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
