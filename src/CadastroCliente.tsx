import  { useEffect, useState } from "react";
import './Cadastro.css'; // Supondo que este arquivo exista e esteja estilizado adequadamente
import { Link } from "react-router-dom";

// Interface para um único cliente, conforme os requisitos do projeto
interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
}

// O estado do formulário pode omitir o id para novos clientes
type FormState = Omit<Cliente, 'id'>;

function CadastroCliente() {
  const API_URL = "http://localhost:8000/clientes";

  const initialFormState: FormState = {
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  };

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [searchQuery, setSearchQuery] = useState("");
  const [mensagem, setMensagem] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca clientes da API
  useEffect(() => {
    const buscaDados = async () => {
      setLoading(true);
      try {
        const url = searchQuery ? `${API_URL}?nome=${encodeURIComponent(searchQuery)}` : API_URL;
        const response = await fetch(url);
        if (!response.ok) {
          let errorText = "Erro ao buscar clientes.";
          try {
            const errorData = await response.json();
            errorText = errorData.message || errorText;
          } catch {}
          setMensagem({ type: 'error', text: errorText });
          setClientes([]);
        } else {
          const data = await response.json();
          setClientes(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        setMensagem({ type: 'error', text: "Não foi possível conectar ao servidor." });
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };
    buscaDados();
  }, [searchQuery]);

  // Limpa mensagem após 3 segundos
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // Função para atualizar o estado do formulário ao digitar nos inputs
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensagem(null);

    const method = editingClient ? "PUT" : "POST";
    const url = editingClient ? `${API_URL}/${editingClient.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const clienteAtualizado = await response.json();
        setMensagem({ type: 'success', text: `Cliente ${editingClient ? 'atualizado' : 'cadastrado'} com sucesso!` });
        setFormData(initialFormState);
        setEditingClient(null);
        // Atualiza lista localmente para evitar novo fetch
        if (editingClient) {
          setClientes(clientes.map(c => c.id === clienteAtualizado.id ? clienteAtualizado : c));
        } else {
          setClientes([...clientes, clienteAtualizado]);
        }
      } else {
        let errorText = "Ocorreu um erro.";
        try {
          const errorData = await response.json();
          errorText = errorData.message || errorText;
        } catch {}
        setMensagem({ type: 'error', text: errorText });
      }
    } catch (error) {
      setMensagem({ type: 'error', text: "Erro na comunicação com a API." });
    }
  };

  // Prepara o formulário para editar um cliente
  const handleEdit = (cliente: Cliente) => {
    setEditingClient(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpf: cliente.cpf,
    });
    window.scrollTo(0, 0); // Rola para o topo para ver o formulário
  };

  // Lida com a exclusão de um cliente
  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
          setMensagem({ type: 'success', text: "Cliente excluído com sucesso!" });
          setClientes(clientes.filter(c => c.id !== id));
        } else {
          const errorData = await response.json();
          setMensagem({ type: 'error', text: errorData.message || "Erro ao excluir cliente." });
        }
      } catch (error) {
        setMensagem({ type: 'error', text: "Não foi possível conectar ao servidor." });
      }
    }
  };

  // Cancela a edição
  const cancelEdit = () => {
    setEditingClient(null);
    setFormData(initialFormState);
    setMensagem(null);
  };

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
        {mensagem && (
          <div className={`mensagem ${mensagem.type}`}>
            <p>{mensagem.text}</p>
          </div>
        )}

        <div className="container-cadastro1">
          <h2>{editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleInputChange} required />
            <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleInputChange} required />
            <input type="submit" value={editingClient ? 'Atualizar Cliente' : 'Cadastrar Cliente'} />
            {editingClient && <button type="button" onClick={cancelEdit}>Cancelar Edição</button>}
          </form>
        </div>

        <div className="container-listagem1">
          <h2>Lista de Clientes</h2>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {loading ? (
            <p>Carregando...</p>
          ) : (
            clientes.map(cliente => (
              <div key={cliente.id} className="cliente-container1">
                <div><strong>Nome:</strong> {cliente.nome}</div>
                <div><strong>Email:</strong> {cliente.email}</div>
                <div><strong>Telefone:</strong> {cliente.telefone}</div>
                <div><strong>CPF:</strong> {cliente.cpf}</div>
                <div className="actions">
                  <button onClick={() => handleEdit(cliente)}>Editar</button>
                  <button onClick={() => handleDelete(cliente.id)}>Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer>
        <p>&copy; 2023 Sistema de E-commerce</p>
      </footer>
    </>
  );
}

export default CadastroCliente;