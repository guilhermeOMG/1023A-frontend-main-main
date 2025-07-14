

import React from 'react';
//import { createBrowserRouter} from 'react-router-dom';
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
        <h2>"Nome"</h2>
        <p>"Bem Vindo a sei la qual coisa"</p>
        <h3>Selecione o tipo de usuário:</h3>
         <Link to="/clientes" className="botao-usuario">Cliente</Link>
          <Link to="/cadastrovendedor" className="botao-usuario">Vendedor</Link>
      </div>
      </main>
    </>
  );
};

export default BlocoCentral;