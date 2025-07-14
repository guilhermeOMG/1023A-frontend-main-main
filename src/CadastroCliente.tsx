import React, { useEffect, useState } from "react";
import './Cadastro.css';
import { Link } from "react-router-dom";

interface ClientesState {
  id: number;
  nome: string;
  email: string;
  endereco: string;
  genero: 'M' | 'F' | 'Outro';
}

function CadastroCliente() {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [genero, setGenero] = useState<'M' | 'F' | 'Outro'>('M');
  const [mensagem, setMensagem] = useState("");
  const [clientes, setClientes] = useState<ClientesState[]>([]);

  useEffect(() => {
    const buscaDados = async () => {
      try {
        const resultado = await fetch("http://localhost:8000/clientes");
        if (resultado.status === 200) {
          const dados = await resultado.json();
          setClientes(dados);
        } else if (resultado.status === 400) {
          const erro = await resultado.json();
          setMensagem(erro.mensagem);
        }
      } catch (erro) {
        setMensagem("Erro ao buscar clientes");
      }
    };
    buscaDados();
  }, []);

  async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novoCliente: Omit<ClientesState, 'id'> & { id?: number } = {
      nome,
      cpf,
      email,
      endereco,
      genero
    };

    if (id !== "") {
      novoCliente.id = parseInt(id);
    }

    try {
      const resposta = await fetch("http://localhost:8000/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoCliente)
      });

      if (resposta.status === 201 || resposta.status === 200) {
        const dados = await resposta.json();
        setClientes([...clientes, dados]);
        setMensagem("Cliente cadastrado com sucesso!");
        // limpar campos
        setId(""); setNome(""); setCpf(""); setEmail(""); setEndereco(""); setGenero('M');
      } else if (resposta.status === 400) {
        const erro = await resposta.json();
        setMensagem(erro.mensagem);
      }
    } catch (erro) {
      setMensagem("Erro ao cadastrar cliente");
    }
  }

  return (
    <>
      <header>
        <div>Logo</div>
      <nav>
         <ul>
          <li><Link to="/BlocoCentral">Home</Link></li>
        </ul>
      </nav>
      </header>

      <main>
        {mensagem && (
          <div className="mensagem1">
            <p>{mensagem}</p>
          </div>
        )}

        <div className="container-listagem1">
          {clientes.map(cliente => (
            <div key={cliente.id} className="cliente-container1">
              <div><strong>Nome:</strong> {cliente.nome}</div>
              <div><strong>CPF:</strong> {cliente.cpf}</div>
              <div><strong>Email:</strong> {cliente.email}</div>
              <div><strong>Endereço:</strong> {cliente.endereco}</div>
              <div><strong>Gênero:</strong> {cliente.genero}</div>
            </div>
          ))}
        </div>

        <div className="container-cadastro1">
          <form onSubmit={TrataCadastro}>
            {/* <input type="text" name="id" placeholder="ID (opcional)" value={id} onChange={e => setId(e.target.value)} /> */}
            <input type="text" name="nome" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input type="text" name="cpf" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
            <input type="email" name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="text" name="endereco" placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} />
            
            <select name="genero" value={genero} onChange={e => setGenero(e.target.value as 'M' | 'F')}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>

            <input type="submit" value="Cadastrar Cliente" />
          </form>
        </div>
      </main>

      <footer></footer>
    </>
  );
}

export default CadastroCliente;
