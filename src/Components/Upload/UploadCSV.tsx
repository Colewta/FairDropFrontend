import { useState } from 'react';
import { api } from '../../services/api';

export default function UploadCSV() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/predict', formData);

    console.log(response.data);
  };

  return (
    <div>
      <label htmlFor="fileInput">Selecione um arquivo CSV</label>
      <input
        id="fileInput"
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload}>
        Enviar
      </button>
    </div>
  );
}
