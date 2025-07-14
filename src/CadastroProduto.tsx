import React, { useEffect, useState } from "react";
import './Cadastro.css';
import { Link } from "react-router-dom";

// Interface para um único produto
interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  id_categoria: number;
}

// Interface para uma categoria
interface Categoria {
  id: number;
  nome: string;
}

// Estado do formulário para produtos
type FormState = Omit<Produto, 'id'>;

function CadastroProduto() {
  const API_URL_PRODUTOS = "http://localhost:8000/produtos";
  const API_URL_CATEGORIAS = "http://localhost:8000/categorias";

  const initialFormState: FormState = {
    nome: "",
    descricao: "",
    preco: 0,
    estoque: 0,
    id_categoria: 1, // Categoria padrão
  };

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [searchQuery, setSearchQuery] = useState("");
  const [mensagem, setMensagem] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca produtos e categorias
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Busca produtos
        const urlProdutos = searchQuery ? `${API_URL_PRODUTOS}?nome=${searchQuery}` : API_URL_PRODUTOS;
        const produtosResponse = await fetch(urlProdutos);
        if (produtosResponse.ok) {
          setProdutos(await produtosResponse.json());
        } else {
            throw new Error("Erro ao buscar produtos.");
        }

        // Busca categorias
        const categoriasResponse = await fetch(API_URL_CATEGORIAS);
        if (categoriasResponse.ok) {
            setCategorias(await categoriasResponse.json());
        } else {
            throw new Error("Erro ao buscar categorias.");
        }

      } catch (error) {
        setMensagem({ type: 'error', text: "Não foi possível conectar ao servidor para buscar dados." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  // Lida com as mudanças nos inputs do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: (name === 'preco' || name === 'estoque' || name === 'id_categoria') ? parseFloat(value) : value,
    });
  };

  // Lida com a submissão do formulário
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensagem(null);

    const method = editingProduto ? "PUT" : "POST";
    const url = editingProduto ? `${API_URL_PRODUTOS}/${editingProduto.id}` : API_URL_PRODUTOS;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMensagem({ type: 'success', text: `Produto ${editingProduto ? 'atualizado' : 'criado'} com sucesso!` });
        setFormData(initialFormState);
        setEditingProduto(null);
        // Recarrega a lista
        const updatedList = await (await fetch(API_URL_PRODUTOS)).json();
        setProdutos(updatedList);
      } else {
        const errorData = await response.json();
        setMensagem({ type: 'error', text: errorData.message || "Ocorreu um erro." });
      }
    } catch (error) {
      setMensagem({ type: 'error', text: "Erro na comunicação com a API." });
    }
  };

  // Prepara o formulário para edição
  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      estoque: produto.estoque,
      id_categoria: produto.id_categoria,
    });
    window.scrollTo(0, 0); // Rola para o formulário
  };

  // Lida com a exclusão do produto
  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const response = await fetch(`${API_URL_PRODUTOS}/${id}`, { method: "DELETE" });
        if (response.ok) {
          setMensagem({ type: 'success', text: "Produto excluído com sucesso!" });
          setProdutos(produtos.filter(p => p.id !== id));
        } else {
          const errorData = await response.json();
          setMensagem({ type: 'error', text: errorData.message || "Erro ao excluir produto." });
        }
      } catch (error) {
        setMensagem({ type: 'error', text: "Não foi possível conectar ao servidor." });
      }
    }
  };
 
  // Cancela a edição
  const cancelEdit = () => {
    setEditingProduto(null);
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
          <h2>{editingProduto ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="nome" placeholder="Nome do Produto" value={formData.nome} onChange={handleInputChange} required />
            <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleInputChange} required />
            <input type="number" name="preco" placeholder="Preço" step="0.01" value={formData.preco} onChange={handleInputChange} required />
            <input type="number" name="estoque" placeholder="Quantidade em Estoque" value={formData.estoque} onChange={handleInputChange} required />
            <select name="id_categoria" value={formData.id_categoria} onChange={handleInputChange} required>
              <option value="">Selecione uma Categoria</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
            <input type="submit" value={editingProduto ? 'Atualizar Produto' : 'Cadastrar Produto'} />
            {editingProduto && <button type="button" onClick={cancelEdit}>Cancelar Edição</button>}
          </form>
        </div>

        <div className="container-listagem1">
          <h2>Lista de Produtos</h2>
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
            produtos.map(produto => (
              <div key={produto.id} className="produto-container1">
                <div><strong>Nome:</strong> {produto.nome}</div>
                <div><strong>Descrição:</strong> {produto.descricao}</div>
                <div><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</div>
                <div><strong>Estoque:</strong> {produto.estoque}</div>
                <div><strong>Categoria:</strong> {categorias.find(c => c.id === produto.id_categoria)?.nome || 'N/A'}</div>
                <div className="actions">
                  <button onClick={() => handleEdit(produto)}>Editar</button>
                  <button onClick={() => handleDelete(produto.id)}>Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <footer></footer>
    </>
  );
}

export default CadastroProduto;  