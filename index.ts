import mysql from 'mysql2/promise';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';

const app = fastify();
app.register(cors);

// Função utilitária para conectar ao banco
async function conectarBanco() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gerenciamento_produtos',
    port: 3306
  });
}

// ===================== ROTAS ========================== //

// GET: Buscar todos os clientes
app.get('/clientes', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await conectarBanco();
    const [dados] = await conn.query('SELECT * FROM clientes');
    reply.status(200).send(dados);
    await conn.end();
  } catch (erro: any) {
    tratarErro(erro, reply);
  }
});

// POST: Cadastrar um cliente
app.post('/clientes', async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, nome, email, senha, telefone } = request.body as any;

  try {
    const conn = await conectarBanco();
    await conn.query(
      'INSERT INTO clientes (id, nome, email, senha, telefone) VALUES (?, ?, ?, ?, ?)',
      [id, nome, email, senha, telefone]
    );
    reply.status(201).send({ id, nome, email, senha, telefone });
    await conn.end();
  } catch (erro: any) {
    tratarErro(erro, reply);
  }
});

// GET: Perfil do primeiro vendedor
app.get('/perfilvendedor', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await conectarBanco();
    const [rows]: any = await conn.query('SELECT * FROM vendedores LIMIT 1');

    if (rows.length > 0) {
      reply.code(200).send(rows[0]);
    } else {
      reply.code(404).send({ mensagem: 'Nenhum vendedor encontrado.' });
    }
    await conn.end();
  } catch (e: any) {
    tratarErro(e, reply);
  }
});

// DELETE: Deletar conta do vendedor
app.delete('/vendedor/:id', async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  try {
    const conn = await conectarBanco();
    const [result]: any = await conn.query('DELETE FROM vendedores WHERE id = ?', [id]);
    await conn.end();

    if (result.affectedRows > 0) {
      reply.code(200).send({ mensagem: 'Vendedor deletado com sucesso.' });
    } else {
      reply.code(404).send({ mensagem: 'Vendedor não encontrado.' });
    }
  } catch (e: any) {
    tratarErro(e, reply);
  }
});

// ===================== FUNÇÃO DE ERRO ========================== //

function tratarErro(erro: any, reply: FastifyReply) {
  switch (erro.code) {
    case 'ECONNREFUSED':
      console.log('ERRO: Banco de dados não conectado.');
      reply.status(400).send({ mensagem: 'ERRO: Banco de dados não conectado.' });
      break;
    case 'ER_BAD_DB_ERROR':
      console.log('ERRO: Banco de dados não encontrado.');
      reply.status(400).send({ mensagem: 'ERRO: Banco de dados não encontrado.' });
      break;
    case 'ER_ACCESS_DENIED_ERROR':
      console.log('ERRO: Usuário ou senha incorretos.');
      reply.status(400).send({ mensagem: 'ERRO: Usuário ou senha incorretos.' });
      break;
    case 'ER_DUP_ENTRY':
      console.log('ERRO: ID duplicado na tabela.');
      reply.status(400).send({ mensagem: 'ERRO: ID duplicado na tabela.' });
      break;
    case 'ER_NO_SUCH_TABLE':
      console.log('ERRO: Tabela não existe.');
      reply.status(400).send({ mensagem: 'ERRO: Tabela não existe.' });
      break;
    default:
      console.log(erro);
      reply.status(500).send({ mensagem: 'ERRO: Erro desconhecido. Veja o terminal.' });
  }
}

// ===================== INICIALIZAÇÃO DO SERVIDOR ========================== //

app.listen({ port: 8000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
