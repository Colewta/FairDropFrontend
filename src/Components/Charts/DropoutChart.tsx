import { PieChart, Pie, Cell } from 'recharts';

export default function DropoutChart({ predictions }: { predictions: number[] }) {
  const data = [
    {
      name: 'Evadidos',
      value: predictions.filter(p => p === 1).length
    },
    {
      name: 'Ativos',
      value: predictions.filter(p => p === 0).length
    }
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2>Evasão</h2>

      <PieChart width={300} height={300}>
        <Pie data={data} dataKey="value" outerRadius={100}>
          {data.map((_, i) => <Cell key={i} />)}
        </Pie>
      </PieChart>
    </div>
  );
}