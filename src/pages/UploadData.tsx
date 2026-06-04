import { useMemo, useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import { MODEL_OPTIONS } from '../types/model';
import type { ModelType, TrainingFormData } from '../types/model';

type UploadDataProps = {
  onTrain: (data: TrainingFormData) => Promise<void>;
  isTraining: boolean;
  error: string | null;
};

function detectDelimiter(headerLine: string) {
  const delimiters = [',', ';', '\t', '|'];

  return delimiters.reduce((best, delimiter) => {
    const count = splitCsvLine(headerLine, delimiter).length;
    const bestCount = splitCsvLine(headerLine, best).length;
    return count > bestCount ? delimiter : best;
  }, ',');
}

function splitCsvLine(line: string, delimiter: string) {
  const columns: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === delimiter && !insideQuotes) {
      columns.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  columns.push(current.trim());
  return columns.filter(Boolean);
}

async function readCsvColumns(file: File) {
  const preview = await file.slice(0, 64000).text();
  const headerLine = preview.split(/\r?\n/).find((line) => line.trim().length > 0);

  if (!headerLine) {
    return [];
  }

  return splitCsvLine(headerLine.replace(/^\uFEFF/, ''), detectDelimiter(headerLine));
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadData({ onTrain, isTraining, error }: UploadDataProps) {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [sensitive, setSensitive] = useState('');
  const [modelType, setModelType] = useState<ModelType>('rf');
  const [localError, setLocalError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => Boolean(file && target && sensitive && target !== sensitive && !isTraining),
    [file, isTraining, sensitive, target],
  );

  async function applyFile(selectedFile: File | undefined) {
    setLocalError(null);

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setLocalError('Selecione um arquivo CSV valido.');
      return;
    }

    setFile(selectedFile);
    const detectedColumns = await readCsvColumns(selectedFile);
    setColumns(detectedColumns);
    setTarget(detectedColumns.includes(target) ? target : '');
    setSensitive(detectedColumns.includes(sensitive) ? sensitive : '');
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    void applyFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void applyFile(event.dataTransfer.files?.[0]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setLocalError('Selecione um CSV antes de iniciar o treinamento.');
      return;
    }

    if (!target || !sensitive) {
      setLocalError('Informe a coluna alvo e a coluna sensivel para executar a analise.');
      return;
    }

    if (target === sensitive) {
      setLocalError('A coluna alvo e a coluna sensivel precisam ser diferentes.');
      return;
    }

    void onTrain({ file, target, sensitive, modelType });
  }

  return (
    <form className="upload-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="section-kicker">Entrada de dados</span>
        <h2>Treinamento e avaliacao do modelo</h2>
      </div>

      <label
        className="file-dropzone"
        htmlFor="csvFile"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input id="csvFile" type="file" accept=".csv,text/csv" onChange={handleFileChange} />
        <span className="file-dropzone-title">{file ? file.name : 'Selecionar dataset CSV'}</span>
        <span className="file-dropzone-meta">
          {file ? `${formatFileSize(file.size)} - ${columns.length} colunas detectadas` : 'Arraste o arquivo para esta area'}
        </span>
      </label>

      <div className="field-grid">
        <label className="field-group" htmlFor="targetColumn">
          <span>Coluna alvo</span>
          <select id="targetColumn" value={target} onChange={(event) => setTarget(event.target.value)}>
            <option value="">Selecionar target</option>
            {columns.map((column) => (
              <option value={column} key={column}>
                {column}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group" htmlFor="sensitiveColumn">
          <span>Grupo sensivel</span>
          <select id="sensitiveColumn" value={sensitive} onChange={(event) => setSensitive(event.target.value)}>
            <option value="">Selecionar atributo</option>
            {columns.map((column) => (
              <option value={column} key={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="model-selector">
        <legend>Algoritmo</legend>
        <div className="model-options">
          {MODEL_OPTIONS.map((option) => (
            <label className={modelType === option.value ? 'model-option is-selected' : 'model-option'} key={option.value}>
              <input
                type="radio"
                name="modelType"
                value={option.value}
                checked={modelType === option.value}
                onChange={() => setModelType(option.value)}
              />
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {columns.length > 0 ? (
        <div className="column-preview" aria-label="Colunas detectadas no CSV">
          {columns.slice(0, 10).map((column) => (
            <span key={column}>{column}</span>
          ))}
          {columns.length > 10 ? <span>+{columns.length - 10}</span> : null}
        </div>
      ) : null}

      {localError || error ? <p className="form-error">{localError ?? error}</p> : null}

      <button className="primary-button" type="submit" disabled={!canSubmit}>
        {isTraining ? 'Treinando modelo...' : 'Executar analise'}
      </button>
    </form>
  );
}
