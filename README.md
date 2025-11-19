# Frontend - Cadastro de Alunos

Interface web desenvolvida em React para cadastro e gerenciamento de alunos.

## 🚀 Tecnologias

- **React** - Biblioteca JavaScript para interfaces
- **Axios** - Cliente HTTP para requisições
- **React Toastify** - Notificações toast

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente. Copie o arquivo `env.example` para `.env`:

```bash
cp env.example .env
```

3. Edite o arquivo `.env` com a URL da API:

```env
REACT_APP_API_URL=http://localhost:3001
```

## ▶️ Como Rodar

### Modo Desenvolvimento

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

O build será gerado na pasta `build/`

## 🏗️ Estrutura do Projeto

```
front/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AlunoForm.js      # Formulário de cadastro
│   │   └── PasswordStrength.js # Validação de senha
│   ├── services/
│   │   └── api.js            # Configuração do Axios
│   ├── App.js                # Componente principal
│   └── index.js              # Ponto de entrada
└── package.json
```

## 🐳 Docker

Para rodar com Docker:

```bash
docker build -t alunos-frontend .
docker run -p 80:80 alunos-frontend
```

## 📝 Notas

- A aplicação se conecta automaticamente à API configurada em `REACT_APP_API_URL`
- As variáveis de ambiente do React precisam começar com `REACT_APP_` para serem acessíveis no código
