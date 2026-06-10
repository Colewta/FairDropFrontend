import type { ModelMetrics } from '../../types/model';
import AccuracyCard from './AccuracyCard';

type MetricGridProps = {
  metrics: ModelMetrics;
};

function getTone(value: number | null) {
  if (value === null) {
    return 'neutral';
  }

  if (value >= 0.75) {
    return 'good';
  }

  if (value >= 0.6) {
    return 'warning';
  }

  return 'neutral';
}

export default function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="metric-grid">
      <AccuracyCard label="Acurácia" value={metrics.accuracy} helper="Acertos gerais no conjunto de teste" tone={getTone(metrics.accuracy)} />
      <AccuracyCard label="Precisão" value={metrics.precision} helper="Confiabilidade entre alertas de evasão" tone={getTone(metrics.precision)} />
      <AccuracyCard label="Recall" value={metrics.recall} helper="Capacidade de encontrar estudantes em risco" tone={getTone(metrics.recall)} />
      <AccuracyCard label="F1-score" value={metrics.f1} helper="Equilíbrio entre precisão e recall" tone={getTone(metrics.f1)} />
      <AccuracyCard label="ROC AUC" value={metrics.roc_auc} helper="Separação entre classes quando disponível" tone={getTone(metrics.roc_auc)} />
    </div>
  );
}
