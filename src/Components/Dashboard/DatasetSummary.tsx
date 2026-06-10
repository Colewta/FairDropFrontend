import type { DatasetSummary as DatasetSummaryType, PreprocessingSummary } from '../../types/model';

type DatasetSummaryProps = {
  dataset: DatasetSummaryType;
  preprocessing: PreprocessingSummary;
};

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function DatasetSummary({ dataset }: DatasetSummaryProps) {
  const retentionRate = dataset.total_linhas > 0 ? dataset.linhas_apos_limpeza / dataset.total_linhas : 0;
  const splitTotal = dataset.treino + dataset.teste;
  const trainRate = splitTotal > 0 ? dataset.treino / splitTotal : 0;

  return (
    <article className="summary-card">
      <div className="card-heading">
        <span className="section-kicker">Dataset</span>
        <h3>Amostra e preprocessamento</h3>
      </div>

      <div className="summary-grid">
        <div>
          <span>Total</span>
          <strong>{dataset.total_linhas}</strong>
        </div>
        <div>
          <span>Após limpeza</span>
          <strong>{dataset.linhas_apos_limpeza}</strong>
        </div>
        <div>
          <span>Treino</span>
          <strong>{dataset.treino}</strong>
        </div>
        <div>
          <span>Teste</span>
          <strong>{dataset.teste}</strong>
        </div>
      </div>

      <div className="progress-block">
        <div>
          <span>Retenção de registros</span>
          <strong>{formatPercent(retentionRate)}</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${Math.min(retentionRate * 100, 100)}%` }} />
        </div>
      </div>

      <div className="progress-block">
        <div>
          <span>Divisão treino</span>
          <strong>{formatPercent(trainRate)}</strong>
        </div>
        <div className="progress-track blue">
          <span style={{ width: `${Math.min(trainRate * 100, 100)}%` }} />
        </div>
      </div>
    </article>
  );
}
