import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { FairnessMetrics } from '../../types/model';

type FairnessSectionProps = {
  fairness: FairnessMetrics;
};

type FairnessKey = keyof Pick<
  FairnessMetrics,
  'statistical_parity_difference' | 'disparate_impact' | 'equal_opportunity_difference' | 'average_odds_difference'
>;

type FairnessMeta = {
  label: string;
  ideal: number;
  mode: 'zero' | 'one';
  description: string;
  criticalMessage: string;
};

const FAIRNESS_META: Record<FairnessKey, FairnessMeta> = {
  statistical_parity_difference: {
    label: 'Statistical parity difference',
    ideal: 0,
    mode: 'zero',
    description: 'Diferença na taxa de resultados positivos entre grupos.',
    criticalMessage: 'Os grupos não estão recebendo resultados positivos em taxas parecidas.',
  },
  disparate_impact: {
    label: 'Disparate impact',
    ideal: 1,
    mode: 'one',
    description: 'Razão entre taxas positivas dos grupos comparados.',
    criticalMessage: 'A proporção de impacto entre os grupos saiu da faixa recomendada.',
  },
  equal_opportunity_difference: {
    label: 'Equal opportunity difference',
    ideal: 0,
    mode: 'zero',
    description: 'Diferença de recall entre grupos.',
    criticalMessage: 'Um grupo está sendo beneficiado com mais acertos do que o outro.',
  },
  average_odds_difference: {
    label: 'Average odds difference',
    ideal: 0,
    mode: 'zero',
    description: 'Média das diferenças de TPR e FPR entre grupos.',
    criticalMessage: 'Os erros e acertos do modelo não estão equilibrados entre os grupos.',
  },
};

function getStatus(meta: FairnessMeta, value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return { label: 'Indisponível', tone: 'neutral' };
  }

  if (meta.mode === 'one') {
    if (value >= 0.8 && value <= 1.25) {
      return { label: 'Adequado', tone: 'good' };
    }

    if (value >= 0.65 && value <= 1.5) {
      return { label: 'Atenção', tone: 'warning' };
    }

    return { label: 'Crítico', tone: 'danger' };
  }

  const distance = Math.abs(value);

  if (distance <= 0.1) {
    return { label: 'Adequado', tone: 'good' };
  }

  if (distance <= 0.2) {
    return { label: 'Atenção', tone: 'warning' };
  }

  return { label: 'Crítico', tone: 'danger' };
}

function formatFairnessValue(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return 'N/A';
  }

  return value.toFixed(3);
}

export default function FairnessSection({ fairness }: FairnessSectionProps) {
  const rows = (Object.keys(FAIRNESS_META) as FairnessKey[]).map((key) => {
    const meta = FAIRNESS_META[key];
    const value = fairness[key];
    const status = getStatus(meta, value);

    return {
      key,
      label: meta.label,
      value,
      ideal: meta.ideal,
      description: meta.description,
      criticalMessage: meta.criticalMessage,
      status: status.label,
      tone: status.tone,
      distance: value === null ? 0 : Math.abs(value - meta.ideal),
    };
  });

  const highlights = rows.filter((row) => row.tone !== 'good' && row.tone !== 'neutral');

  return (
    <article className="chart-card fairness-card">
      <div className="card-heading">
        <span className="section-kicker">Fairness</span>
        <h3>Onde o modelo está justo e onde pede correção</h3>
      </div>

      <div className="fairness-score-banner">
        <span>Fairness score do modelo principal</span>
        <strong>{fairness.fairness_score === null || fairness.fairness_score === undefined ? 'N/A' : `${(fairness.fairness_score * 100).toFixed(1)}%`}</strong>
      </div>

      <div className="chart-frame small">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" hide />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(190, 18, 60, 0.08)' }}
              formatter={(value) => [Number(value).toFixed(3), 'Distância do ideal']}
            />
            <Bar dataKey="distance" radius={[6, 6, 0, 0]}>
              {rows.map((row) => (
                <Cell
                  key={row.key}
                  fill={row.tone === 'good' ? '#15803d' : row.tone === 'warning' ? '#b45309' : row.tone === 'danger' ? '#be123c' : '#64748b'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {highlights.length ? (
        <div className="critical-callout">
          <span>O que está crítico ou em atenção</span>
          {highlights.map((item) => (
            <p key={item.key}>
              <strong>{item.label}:</strong> {item.criticalMessage}
            </p>
          ))}
        </div>
      ) : (
        <div className="critical-callout good">
          <span>Leitura rápida</span>
          <p>As principais métricas estão próximas do ideal para esta execução, sem sinal grave de disparidade entre grupos.</p>
        </div>
      )}

      <div className="fairness-list">
        {rows.map((row) => (
          <div className="fairness-row" key={row.key}>
            <div>
              <strong>{row.label}</strong>
              <p>{row.description}</p>
            </div>
            <div className="fairness-value">
              <span>{formatFairnessValue(row.value)}</span>
              <em className={`status-pill tone-${row.tone}`}>{row.status}</em>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
