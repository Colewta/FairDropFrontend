import { useState } from 'react';
import { api } from '../services/api';
import type { ApiResponse } from '../types/model';

export function usePrediction() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sendFile = async (file: File) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse>('/predict', formData);

    setData(response.data);
    setLoading(false);
  };

  return { data, sendFile, loading };
}
