import { useEffect, useState } from "react"
import './PerfilVendedor.css'

interface VendedorState {
    id: number,
    nome: string,
    cpf: string,
    email: string,
    senha: string,
    genero: string,
}

function PaginaVendedor() {
    const [vendedor, setVendedor] = useState<VendedorState>({
        id: 0,
        nome: "",
        cpf: "",
        email: "",
        senha: "",
        genero: ""
    })

    const [mensagem, setMensagem] = useState("")

    useEffect(() => {
        const buscarVendedor = async () => {
            try {
                const resposta = await fetch("http://localhost:8000/perfilvendedor")
                if (resposta.status === 200) {
                    const dados = await resposta.json()
                    setVendedor(dados)
                } else {
                    const erro = await resposta.json()
                    setMensagem(erro.mensagem || "Erro ao buscar vendedor.")
                }
            } catch (error) {
                setMensagem("Erro de conexão com o servidor.")
            }
        }

        buscarVendedor()
    }, [])

    const deletarConta = async () => {
        try {
            const resposta = await fetch(`http://localhost:8000/vendedor/${vendedor.id}`, {
                method: "DELETE"
            })
            if (resposta.ok) {
                setMensagem("Conta deletada com sucesso.")
                setVendedor({
                    id: 0,
                    nome: "",
                    cpf: "",
                    email: "",
                    senha: "",
                    genero: ""
                })
            } else {
                const erro = await resposta.json()
                setMensagem(erro.mensagem || "Erro ao deletar conta.")
            }
        } catch {
            setMensagem("Erro ao conectar com o servidor.")
        }
    }

    return (
        <>
            <header></header>
            <main>
                {mensagem && <div className="mensagem">{mensagem}</div>}
                <div className="card">
                    <div className="avatar">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png"/>
                    </div>
                    <div className="dados">
                        <h1>{vendedor.nome}</h1>
                        <p><strong>ID:</strong> {vendedor.id}</p>
                        <p><strong>Email:</strong> {vendedor.email}</p>
                        <p><strong>Senha:</strong> {vendedor.senha}</p>
                        <p><strong>Gênero:</strong> {vendedor.genero}</p>
                        <button onClick={deletarConta}>Deletar Conta</button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default PaginaVendedor