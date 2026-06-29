import type { ComparativeSummary, TrainingResult } from '../../types/model';

type ModelComparisonProps = {
  result: TrainingResult;
};

function getWinnerTag(tipo: string, comparativo: ComparativeSummary) {
  const tags: string[] = [];

  if (comparativo.melhor_acuracia?.tipo === tipo) {
    tags.push('Melhor acurácia');
  }

  if (comparativo.melhor_fairness?.tipo === tipo) {
    tags.push('Mais justo');
  }

  if (comparativo.melhor_equilibrio?.tipo === tipo) {
    tags.push('Mais equilibrado');
  }

  return tags;
}

function getTone(accuracy: number, fairnessScore: number | null | undefined) {
  if (accuracy >= 0.75 && (fairnessScore ?? 0) >= 0.75) {
    return 'good';
  }

  if (accuracy >= 0.6 || (fairnessScore ?? 0) >= 0.6) {
    return 'warning';
  }

  return 'neutral';
}

export default function ModelComparison({ result }: ModelComparisonProps) {
  const rows = Object.entries(result.modelos)
    .map(([tipo, info]) => ({
      tipo,
      nome: info.nome,
      accuracy: info.metricas.accuracy,
      f1: info.metricas.f1,
      fairnessScore: info.fairness.fairness_score ?? null,
      tags: getWinnerTag(tipo, result.comparativo_modelos),
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  return (
    <article className="summary-card full-span">
      <div className="card-heading horizontal">
        <div>
          <span className="section-kicker">Comparativo</span>
          <h3>Os quatro modelos na mesma base</h3>
        </div>
        <span className="chart-note">{rows.length} modelos avaliados</span>
      </div>

      <div className="comparison-grid">
        {rows.map((row) => (
          <div className={`comparison-card tone-${getTone(row.accuracy, row.fairnessScore)}`} key={row.tipo}>
            <div className="comparison-card-header">
              <strong>{row.nome}</strong>
              <span>{row.tipo}</span>
            </div>

            <div className="comparison-metrics">
              <div>
                <span>Acurácia</span>
                <strong>{(row.accuracy * 100).toFixed(1)}%</strong>
              </div>
              <div>
                <span>F1-score</span>
                <strong>{(row.f1 * 100).toFixed(1)}%</strong>
              </div>
              <div>
                <span>Fairness score</span>
                <strong>{row.fairnessScore === null ? 'N/A' : `${(row.fairnessScore * 100).toFixed(1)}%`}</strong>
              </div>
            </div>

            {row.tags.length ? (
              <div className="comparison-tags">
                {row.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {result.comparativo_modelos.insights.length ? (
        <div className="analysis-note-list comparison-notes">
          {result.comparativo_modelos.insights.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
