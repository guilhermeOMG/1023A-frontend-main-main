import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import mysql from 'mysql2/promise';

const app = fastify();
app.register(cors);

// ================= CONEXÃO COM BANCO ================= //
async function conectarBanco() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gerenciamento_produtos',
    port: 3306
  });
}

// ===================== ROTAS CLIENTES ========================== //

// GET: Buscar todos os clientes
app.get('/clientes', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await conectarBanco();
    const [dados] = await conn.query('SELECT * FROM clientes');
    await conn.end();
    reply.status(200).send(dados);
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
    await conn.end();
    reply.status(201).send({ id, nome, email, senha, telefone });
  } catch (erro: any) {
    tratarErro(erro, reply);
  }
});

// ===================== ROTAS VENDEDORES ========================== //

// GET: Listar todos os vendedores
app.get('/cadastrovendedor', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await conectarBanco();
    const [dados] = await conn.query('SELECT * FROM vendedores');
    await conn.end();
    reply.status(200).send(dados);
  } catch (erro: any) {
    tratarErro(erro, reply);
  }
});

// POST: Cadastrar novo vendedor
app.post('/cadastrovendedor', async (request: FastifyRequest, reply: FastifyReply) => {
  const { nome, cpf, email, senha, genero } = request.body as any;

  if (!nome || !cpf || !email || !senha || !genero) {
    return reply.status(400).send({ mensagem: 'Preencha todos os campos.' });
  }

  try {
    const conn = await conectarBanco();
    const [resultado]: any = await conn.query(
      'INSERT INTO vendedores (nome, cpf, email, senha, genero) VALUES (?, ?, ?, ?, ?)',
      [nome, cpf, email, senha, genero]
    );
    await conn.end();

    reply.status(200).send({ id: resultado.insertId, nome, cpf, email, senha, genero });
  } catch (erro: any) {
    tratarErro(erro, reply);
  }
});

// GET: Perfil do primeiro vendedor
app.get('/perfilvendedor', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await conectarBanco();
    const [rows]: any = await conn.query('SELECT * FROM vendedores LIMIT 1');
    await conn.end();

    if (rows.length > 0) {
      reply.code(200).send(rows[0]);
    } else {
      reply.code(404).send({ mensagem: 'Nenhum vendedor encontrado.' });
    }
  } catch (e: any) {
    tratarErro(e, reply);
  }
});

// DELETE: Deletar vendedor por ID
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

// ===================== ERRO GENÉRICO ========================== //

function tratarErro(erro: any, reply: FastifyReply) {
  switch (erro.code) {
    case 'ECONNREFUSED':
      console.log('ERRO: Banco de dados não conectado.');
      reply.status(500).send({ mensagem: 'Banco de dados não conectado.' });
      break;
    case 'ER_BAD_DB_ERROR':
      reply.status(500).send({ mensagem: 'Banco de dados não encontrado.' });
      break;
    case 'ER_ACCESS_DENIED_ERROR':
      reply.status(500).send({ mensagem: 'Usuário ou senha incorretos.' });
      break;
    case 'ER_DUP_ENTRY':
      reply.status(400).send({ mensagem: 'Cadastro duplicado.' });
      break;
    case 'ER_NO_SUCH_TABLE':
      reply.status(500).send({ mensagem: 'Tabela não existe.' });
      break;
    default:
      console.error(erro);
      reply.status(500).send({ mensagem: 'Erro desconhecido.' });
  }
}

// ===================== INICIAR SERVIDOR ========================== //

app.listen({ port: 8000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em ${address}`);
});
