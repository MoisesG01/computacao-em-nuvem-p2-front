import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AlunoForm from './components/AlunoForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cadastro de Alunos</h1>
        <p>Sistema de gerenciamento de alunos</p>
      </header>
      <main className="App-main">
        <AlunoForm />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;

