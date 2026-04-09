export type Fairness = {
  [grupo: string]: {
    [categoria: string]: number;
  };
};

export type ApiResponse = {
  accuracy: number;
  predictions: number[];
  fairness: Fairness;
};