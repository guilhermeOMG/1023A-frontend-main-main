import React from 'react';
import { Link } from 'react-router-dom';
import './BlocoCentral.css';

const BlocoCentral: React.FC = () => {
  return (
    <>
    <header>
      <div>Logo</div>
      <nav>
         <ul>
          <li><Link to="/">Home</Link></li>
        </ul>
      </nav>
      </header>
      <main>
      <div className="bloco">
        <h2>Sistema de E-commerce</h2>
        <p>Bem-vindo à área administrativa.</p>
        <h3>Selecione uma área para gerenciar:</h3>
         <Link to="/clientes" className="botao-usuario">Gerenciar Clientes</Link>
         <Link to="/cadastrovendedor" className="botao-usuario">Cadastrar Vendedor</Link>
         <Link to="/produtos" className="botao-usuario">Gerenciar Produtos</Link>
         <Link to="/relatorios" className="botao-usuario">Ver Relatórios</Link>
      </div>
      </main>
    </>
  );
};

export default BlocoCentral;