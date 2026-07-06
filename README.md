# FairDrop Frontend

Interface web do FairDrop para envio de datasets em CSV, configuração da análise e visualização dos resultados de desempenho preditivo e fairness retornados pela API.

## Visão Geral

O frontend deve ser executado localmente com Node.js, sem Docker. Essa separação faz parte da estrutura atual do projeto:

- backend em Docker;
- frontend local com `npm install` e `npm run dev`.

Em ambiente de desenvolvimento, a aplicação espera que o backend esteja disponível em `http://localhost:8000`.

## Pré-requisitos

- Node.js 18 ou superior (`https://nodejs.org/en/download`)
- npm
- backend do projeto em execução

## Como Executar

No diretório `FairDropFrontend`, execute:

```bash
npm install
```

Em seguida:

```bash
npm run dev
```

Após a inicialização, o Vite exibirá a URL local da aplicação, normalmente:

- `http://localhost:5173`

## Integração com o Backend

O fluxo correto para desenvolvimento local é:

1. subir o backend via Docker na pasta `Backend`;
2. iniciar o frontend localmente na pasta `Frontend`.

Por padrão, o frontend usa:

- `http://localhost:8000` em desenvolvimento;
- `/api` em cenários de build/produção, caso seja configurado um proxy ou servidor intermediário.

## Variáveis de Ambiente

Opcionalmente, é possível definir a URL da API manualmente com a variável:

```env
VITE_API_URL=http://localhost:8000
```

Se essa variável não for informada, o projeto já utiliza `http://localhost:8000` automaticamente durante o desenvolvimento.

## Scripts Disponíveis

Executar ambiente de desenvolvimento:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Executar validação com ESLint:

```bash
npm run lint
```

Visualizar a build localmente:

```bash
npm run preview
```

## Observações

- Sempre execute os comandos a partir da pasta `FairDropFrontend`.
- O frontend depende do backend ativo para realizar análise de datasets e treinamento dos modelos.
- Caso a API esteja em outro endereço, ajuste `VITE_API_URL` antes de iniciar o servidor de desenvolvimento.
