import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Relatorios.css'; // Supondo um novo arquivo de CSS para relatórios

interface PedidoDetalhado {
  id_pedido: number;
  data_pedido: string;
  nome_cliente: string;
  email_cliente: string;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
}

function Relatorios() {
  const API_URL = "http://localhost:8000/relatorios/pedidos-detalhados";
  const [relatorio, setRelatorio] = useState<PedidoDetalhado[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    const fetchRelatorio = async () => {
      setLoading(true);
      setMensagem(null);
      try {
        let url = API_URL;
        const params = new URLSearchParams();
        if (dataInicio) params.append('data_inicio', dataInicio);
        if (dataFim) params.append('data_fim', dataFim);
       
        if(params.toString()){
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setRelatorio(data);
        } else {
          const errorData = await response.json();
          setMensagem(errorData.message || "Erro ao buscar relatório.");
        }
      } catch (error) {
        setMensagem("Não foi possível conectar ao servidor.");
      } finally {
        setLoading(false);
      }
    };
   
    const timer = setTimeout(() => {
        fetchRelatorio();
    }, 500); // Debounce para evitar buscas a cada tecla pressionada
   
    return () => clearTimeout(timer);

  }, [dataInicio, dataFim]);

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
        <h2>Relatório de Pedidos Detalhados</h2>
        {mensagem && <div className="mensagem error"><p>{mensagem}</p></div>}
       
        <div className="filtros-relatorio">
            <label>
                Data de Início:
                <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            </label>
            <label>
                Data de Fim:
                <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
            </label>
        </div>

        {loading ? (
          <p>Carregando relatório...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Email Cliente</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.length > 0 ? (
                relatorio.map(item => (
                  <tr key={item.id_pedido}>
                    <td>{item.id_pedido}</td>
                    <td>{new Date(item.data_pedido).toLocaleDateString()}</td>
                    <td>{item.nome_cliente}</td>
                    <td>{item.email_cliente}</td>
                    <td>{item.nome_produto}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {item.preco_unitario.toFixed(2)}</td>
                    <td>R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>Nenhum pedido encontrado para o período.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
      <footer></footer>
    </>
  );
}

export default Relatorios;