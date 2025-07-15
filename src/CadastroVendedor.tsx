import React, { useEffect, useState } from "react"

import './Vendedor.css';
import { Link } from "react-router-dom";

interface VendedorState {
    id: number,
    nome: string,
    cpf: string,
    email: string,
    senha: string,
    genero: string,
}

function CadastroVendedor() {
    const [nome, setNome] = useState("")
    const [cpf, setCPF] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [genero, setGenero] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [vendedor, setVendedor] = useState<VendedorState[]>([])
    useEffect(() => {
        const buscaDados = async () => {
            try{
                const resultado = await fetch("http://localhost:8000/cadastrovendedor")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setVendedor(dados)
                }
                if (resultado.status === 400) {
                    const erro = await resultado.json()
                    setMensagem(erro.mensagem)
                }
            }
            catch(erro){
                setMensagem("Fetch não está funcionando")
            }
        }
        buscaDados()
    }, []);

    
   async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const novoVendedor: Omit<VendedorState, 'id'> & { id?: number } = {
    nome,
    cpf,
    email,
    senha,
    genero
  };


   //if (id !== "") {
   // novoVendedor.id = parseInt(id);
  //}

  try {
    const resposta = await fetch("http://localhost:8000/cadastrovendedor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novoVendedor)
    });

    if (resposta.status === 200) {
      const dados = await resposta.json();
      setVendedor([...vendedor, dados]);
    }

    if (resposta.status === 400) {
      const erro = await resposta.json();
      setMensagem(erro.mensagem);
    }
  } catch (erro) {
    setMensagem("Fetch não functiona");
  }
}
    function trataNome(event: React.ChangeEvent<HTMLInputElement>) {
        setNome(event.target.value)
    }
    function trataCPF(event: React.ChangeEvent<HTMLInputElement>) {
        setCPF(event.target.value)
    }
    function trataEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }
    function trataSenha(event: React.ChangeEvent<HTMLInputElement>) {
        setSenha(event.target.value)
    }
    function trataGenero(event: React.ChangeEvent<HTMLSelectElement>) {
        setGenero(event.target.value)
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
                {mensagem &&
                    <div className="mensagem">
                        <p>{mensagem}</p>
                    </div>
                }

                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="text" name="nome" id="nome" onChange={trataNome} placeholder="Nome" />
                        <input type="text" name="cpf" id="cpf" onChange={trataCPF} placeholder="CPF" />
                        <input type="email" name="email" id="email" onChange={trataEmail} placeholder="Email" />
                        <input type="password" name="senha" id="senha" onChange={trataSenha}placeholder="Senha" />
                        <select name="genero" id="genero" onChange={trataGenero}>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                        <input type="submit" value="Cadastrar" />
                    </form>
                </div>
            </main>
            <footer></footer>
        </>
    )
}
export default CadastroVendedor;