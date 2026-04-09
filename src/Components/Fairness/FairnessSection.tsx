type Props = {
  fairness: {
    [grupo: string]: {
      [categoria: string]: number;
    };
  };
};

export default function FairnessSection({ fairness }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold">Fairness</h2>

      {Object.entries(fairness).map(([grupo, categorias]) => (
        <div key={grupo} className="mt-4">
          <h3 className="font-bold">{grupo}</h3>

          {Object.entries(categorias).map(([categoria, valor]) => (
            <div key={categoria} className="flex justify-between">
              <span>{categoria}</span>
              <span>{valor.toFixed(2)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}