type Props = {
  accuracy: number;
};

export default function AccuracyCard({ accuracy }: Props) {
  const percentage = (accuracy * 100).toFixed(2);

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Acuracia</h2>
      <p className="mt-2 text-3xl font-bold">{percentage}%</p>
    </div>
  );
}
