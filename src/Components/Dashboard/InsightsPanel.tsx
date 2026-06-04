import type { FairnessMetrics, TrainingResult } from '../../types/model';

type InsightsPanelProps = {
  result: TrainingResult;
};

type Insight = {
  title: string;
  text: string;
  tone: 'good' | 'warning' | 'danger' | 'neutral';
};

function hasCriticalFairness(fairness: FairnessMetrics) {
  const zeroCentered = [
    fairness.statistical_parity_difference,
    fairness.equal_opportunity_difference,
    fairness.average_odds_difference,
  ];

  const zeroCritical = zeroCentered.some((value) => value !== null && Math.abs(value) > 0.2);
  const disparateImpact = fairness.disparate_impact;
  const impactCritical = disparateImpact !== null && (disparateImpact < 0.65 || disparateImpact > 1.5);

  return zeroCritical || impactCritical;
}

function buildInsights(result: TrainingResult): Insight[] {
  const insights: Insight[] = [];
  const { metricas: metrics, fairness, feature_importance: importances } = result;

  if (metrics.recall >= 0.75) {
    insights.push({
      title: 'Boa captura de evasao',
      text: 'O recall indica que o modelo identifica uma parcela relevante dos estudantes em risco.',
      tone: 'good',
    });
  } else {
    insights.push({
      title: 'Recall pede atencao',
      text: 'Para evasao academica, falsos negativos podem esconder estudantes que precisariam de intervencao.',
      tone: 'warning',
    });
  }

  if (metrics.precision < 0.6) {
    insights.push({
      title: 'Muitos alertas podem ser falsos',
      text: 'A precisao abaixo de 60% sugere cautela antes de usar o resultado para priorizar atendimentos.',
      tone: 'warning',
    });
  }

  if (hasCriticalFairness(fairness)) {
    insights.push({
      title: 'Sinal forte de vies',
      text: 'Ao menos uma metrica de fairness esta distante do intervalo recomendado para comparacao entre grupos.',
      tone: 'danger',
    });
  } else {
    insights.push({
      title: 'Fairness em faixa controlada',
      text: 'As metricas principais nao indicam diferenca extrema entre os grupos sensiveis nesta execucao.',
      tone: 'good',
    });
  }

  const topFeature = Object.entries(importances).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];

  if (topFeature) {
    insights.push({
      title: 'Variavel dominante',
      text: `${topFeature[0]} aparece como a variavel mais influente do modelo selecionado.`,
      tone: 'neutral',
    });
  }

  return insights;
}

export default function InsightsPanel({ result }: InsightsPanelProps) {
  const insights = buildInsights(result);

  return (
    <article className="summary-card insight-card">
      <div className="card-heading">
        <span className="section-kicker">Leitura tecnica</span>
        <h3>Resumo para discussao</h3>
      </div>

      <div className="insight-list">
        {insights.map((insight) => (
          <div className={`insight-item tone-${insight.tone}`} key={insight.title}>
            <strong>{insight.title}</strong>
            <p>{insight.text}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
