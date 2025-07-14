import mysql from 'mysql2/promise';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';

const app = fastify();
app.register(cors);

// ROTAS ===========================

// GET: Buscar todos os clientes
app.get('/clientes', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'gerenciamento_produtos',
            port: 3306
        });

        const resultado = await conn.query("SELECT * FROM clientes");
        const [dados] = resultado;
        reply.status(200).send(dados);
    } catch (erro: any) {
        tratarErro(erro, reply);
    }
});

// POST: Cadastrar um cliente
app.post('/clientes', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, nome, email, telefone } = request.body as any;

    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'gerenciamento_produtos',
            port: 3306
        });

        await conn.query(
            "INSERT INTO clientes (id, nome, email, telefone) VALUES (?, ?, ?, ?)",
            [id, nome, email, telefone]
        );

        reply.status(201).send({ id, nome, email, telefone });
    } catch (erro: any) {
        tratarErro(erro, reply);
    }
});

// FUNÇÃO DE ERRO ===========================

function tratarErro(erro: any, reply: FastifyReply) {
    switch (erro.code) {
        case "ECONNREFUSED":
            console.log("ERRO: Banco de dados não conectado.");
            reply.status(400).send({ mensagem: "ERRO: Banco de dados não conectado." });
            break;
        case "ER_BAD_DB_ERROR":
            console.log("ERRO: Banco de dados não encontrado.");
            reply.status(400).send({ mensagem: "ERRO: Banco de dados não encontrado." });
            break;
        case "ER_ACCESS_DENIED_ERROR":
            console.log("ERRO: Usuário ou senha incorretos.");
            reply.status(400).send({ mensagem: "ERRO: Usuário ou senha incorretos." });
            break;
        case "ER_DUP_ENTRY":
            console.log("ERRO: ID duplicado na tabela.");
            reply.status(400).send({ mensagem: "ERRO: ID duplicado na tabela." });
            break;
        case "ER_NO_SUCH_TABLE":
            console.log("ERRO: Tabela clientes não existe.");
            reply.status(400).send({ mensagem: "ERRO: Tabela clientes não existe." });
            break;
        default:
            console.log(erro);
            reply.status(400).send({ mensagem: "ERRO: Erro desconhecido, veja o terminal." });
    }
}

// INICIALIZAÇÃO DO SERVIDOR ===========================

app.listen({ port: 8000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Servidor rodando em ${address}`);
});
