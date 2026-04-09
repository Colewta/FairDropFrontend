import { useLocation } from 'react-router-dom';
import type { ApiResponse } from '../types/model';
import AccuracyCard from '../Components/Metrics/AccuracyCard';
import DropoutChart from '../Components/Charts/DropoutChart';
import FairnessSection from '../Components/Fairness/FairnessSection';

export default function Dashboard() {
  const location = useLocation();
  const data = location.state as ApiResponse;

  if (!data) return <p>Sem dados</p>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      <AccuracyCard accuracy={data.accuracy} />

      <DropoutChart predictions={data.predictions} />

      <FairnessSection fairness={data.fairness} />

    </div>
  );
}
