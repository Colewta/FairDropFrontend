export type ModelType = 'logistic' | 'rf' | 'knn' | 'xgboost';

export type TrainingFormData = {
  file: File;
  target: string;
  sensitive: string;
  modelType: ModelType;
};

export type ModelOption = {
  value: ModelType;
  label: string;
  description: string;
};

export type ModelMetrics = {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number | null;
  confusion_matrix: number[][];
};

export type FairnessMetrics = {
  statistical_parity_difference: number | null;
  disparate_impact: number | null;
  equal_opportunity_difference: number | null;
  average_odds_difference: number | null;
};

export type DatasetSummary = {
  total_linhas: number;
  linhas_apos_limpeza: number;
  treino: number;
  teste: number;
};

export type PreprocessingSummary = {
  target_binarizado: Record<string, number>;
};

export type TrainingResult = {
  modelo: ModelType | string;
  metricas: ModelMetrics;
  fairness: FairnessMetrics;
  feature_importance: Record<string, number>;
  dataset: DatasetSummary;
  preprocessamento: PreprocessingSummary;
};

export const MODEL_OPTIONS: ModelOption[] = [
  {
    value: 'rf',
    label: 'Random Forest',
    description: 'Bom equilibrio para dados tabulares e importancia de variaveis.',
  },
  {
    value: 'logistic',
    label: 'Regressao Logistica',
    description: 'Modelo interpretavel para linha de base academica.',
  },
  {
    value: 'knn',
    label: 'KNN',
    description: 'Compara estudantes por proximidade entre caracteristicas.',
  },
  {
    value: 'xgboost',
    label: 'XGBoost',
    description: 'Modelo robusto para capturar relacoes nao lineares.',
  },
];
