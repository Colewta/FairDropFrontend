import type { FairnessMetrics, TrainingResult } from '../../types/model';

type InsightsPanelProps = {
  result: TrainingResult;
};

type Insight = {
  title: string;
  text: string;
  tone: 'good' | 'warning' | 'danger' | 'neutral';
};

function getFairnessAlerts(fairness: FairnessMetrics) {
  const alerts: string[] = [];

  if (fairness.statistical_parity_difference !== null && Math.abs(fairness.statistical_parity_difference) > 0.2) {
    alerts.push('A taxa de resultados positivos entre os grupos está distante do ideal.');
  }

  if (fairness.equal_opportunity_difference !== null && Math.abs(fairness.equal_opportunity_difference) > 0.2) {
    alerts.push('O recall está desigual entre os grupos, então um grupo pode estar recebendo menos acertos de proteção.');
  }

  if (fairness.average_odds_difference !== null && Math.abs(fairness.average_odds_difference) > 0.2) {
    alerts.push('Os erros do modelo não estão distribuídos de forma equilibrada entre os grupos.');
  }

  if (fairness.disparate_impact !== null && (fairness.disparate_impact < 0.8 || fairness.disparate_impact > 1.25)) {
    alerts.push('A razão de impacto entre grupos saiu da faixa usualmente aceitável.');
  }

  return alerts;
}

function buildInsights(result: TrainingResult): Insight[] {
  const insights: Insight[] = [];
  const { metricas, fairness, feature_importance, comparativo_modelos } = result;
  const fairnessAlerts = getFairnessAlerts(fairness);

  if (
    comparativo_modelos.melhor_acuracia
    && comparativo_modelos.melhor_fairness
    && comparativo_modelos.melhor_acuracia.tipo !== comparativo_modelos.melhor_fairness.tipo
  ) {
    insights.push({
      title: 'Trade-off entre precisão e justiça',
      text: `${comparativo_modelos.melhor_acuracia.nome} foi o mais preciso, mas ${comparativo_modelos.melhor_fairness.nome} teve o melhor fairness score.`,
      tone: 'warning',
    });
  } else if (comparativo_modelos.melhor_equilibrio) {
    insights.push({
      title: 'Melhor equilíbrio geral',
      text: `${comparativo_modelos.melhor_equilibrio.nome} apresentou a combinação mais estável entre desempenho e fairness nesta base.`,
      tone: 'good',
    });
  }

  if (metricas.recall >= 0.75) {
    insights.push({
      title: 'Boa captura de casos críticos',
      text: 'O recall do modelo principal indica boa capacidade de encontrar estudantes em risco dentro do conjunto de teste.',
      tone: 'good',
    });
  } else {
    insights.push({
      title: 'Recall pede atenção',
      text: 'O modelo ainda pode deixar passar estudantes em risco, então intervenções baseadas nele devem ser cautelosas.',
      tone: 'warning',
    });
  }

  if (fairnessAlerts.length > 0) {
    insights.push({
      title: 'Fairness em condição crítica',
      text: fairnessAlerts[0],
      tone: 'danger',
    });
  } else {
    insights.push({
      title: 'Fairness sob controle nesta execução',
      text: 'As métricas principais não mostram uma distância severa em relação ao ideal entre os grupos sensíveis.',
      tone: 'good',
    });
  }

  const topFeature = Object.entries(feature_importance).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];

  if (topFeature) {
    insights.push({
      title: 'Variável dominante',
      text: `${topFeature[0]} aparece como a variável mais influente do modelo principal exibido no painel.`,
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
        <span className="section-kicker">Leitura guiada</span>
        <h3>Resumo amigável para discussão</h3>
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
