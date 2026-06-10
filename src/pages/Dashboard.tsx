import DropoutChart from '../Components/Charts/DropoutChart';
import FeatureImportanceChart from '../Components/Charts/FeatureImportanceChart';
import DatasetSummary from '../Components/Dashboard/DatasetSummary';
import InsightsPanel from '../Components/Dashboard/InsightsPanel';
import FairnessSection from '../Components/Fairness/FairnessSection';
import MetricGrid from '../Components/Metrics/MetricGrid';
import type { TrainingResult } from '../types/model';

type DashboardProps = {
  result: TrainingResult | null;
};

export default function Dashboard({ result }: DashboardProps) {
  if (!result) {
    return (
      <section className="empty-dashboard" aria-label="Dashboard aguardando dados">
        <div>
          <span className="section-kicker">Dashboard</span>
          <h2>Aguardando a primeira análise</h2>
          <p>Depois do treinamento, os indicadores do modelo e de fairness aparecem aqui em painéis comparáveis.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-shell" id="dashboard" aria-label="Resultados da analise">
      <div className="dashboard-heading">
        <div>
          <span className="section-kicker">Resultados</span>
          <h2>Desempenho preditivo e vieses detectados</h2>
        </div>
        <span className="model-badge">{result.modelo}</span>
      </div>

      <MetricGrid metrics={result.metricas} />

      <div className="dashboard-grid two-columns">
        <DropoutChart confusionMatrix={result.metricas.confusion_matrix} />
        <DatasetSummary dataset={result.dataset} preprocessing={result.preprocessamento} />
      </div>

      <div className="dashboard-grid two-columns wide-left">
        <FairnessSection fairness={result.fairness} />
        <InsightsPanel result={result} />
      </div>

      <FeatureImportanceChart importances={result.feature_importance} />
    </section>
  );
}
