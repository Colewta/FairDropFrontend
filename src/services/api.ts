import axios from 'axios';
import type { TrainingFormData, TrainingResult } from '../types/model';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export async function trainModel(payload: TrainingFormData) {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('target', payload.target);
  formData.append('sensitive', payload.sensitive);
  formData.append('model_type', payload.modelType);

  const response = await api.post<TrainingResult>('/train', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg ?? JSON.stringify(item)).join(' ');
    }

    if (typeof detail === 'string') {
      return detail;
    }

    if (error.code === 'ECONNABORTED') {
      return 'O treinamento demorou mais que o esperado. Verifique o backend e tente novamente.';
    }

    if (!error.response) {
      return 'Nao foi possivel conectar ao backend. Confirme se a API FastAPI esta rodando em localhost:8000.';
    }
  }

  return 'Nao foi possivel concluir a analise. Revise o arquivo e os parametros selecionados.';
}
