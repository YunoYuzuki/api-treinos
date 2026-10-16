const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('treinos.db');
const express = require('express');

const app = express();

// IMPORTANTE: Esta linha DEVE vir aqui em cima, antes de todas as rotas!
app.use(express.json());

db.exec(`
    CREATE TABLE IF NOT EXISTS treinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        duracao INTEGER NOT NULL
    )
`);

function validarTreino(corpo){
    if(!corpo || typeof corpo.nome !== 'string' || corpo.nome.trim() === ''){
        return 'O campo nome eh obrigatorio e deve ser um texto.';
    }
    if(typeof corpo.duracao !== 'number' || corpo.duracao <= 0){
        return 'O campo duracao eh obrigatorio e deve ser um numero maior que zero.';
    }
    return null;
}

const total = db.prepare('SELECT COUNT(*) AS total FROM treinos').get().total;

if (total === 0) {
    const inserir = db.prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)');
    inserir.run('Costas', 60);
    inserir.run('Peito', 45);
    inserir.run('Perna', 70);
    inserir.run('Triceps', 30);
    inserir.run('Biceps', 30);
    inserir.run('Ombro', 40);
}

// ROTA 2, 3, 6 e 7 - Criar um treino
app.post('/treinos', (req, res) => {
    const corpo = req.body;

    const erroValidacao = validarTreino(corpo);
    if (erroValidacao) {
        return res.status(400).json({ erro: erroValidacao });
    }

    const inserir = db.prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)');
    const resultado = inserir.run(corpo.nome, corpo.duracao);
    
    res.status(201).json({
        id: resultado.lastInsertRowid,
        nome: corpo.nome,
        duracao: corpo.duracao
    });
});

// ROTA 1 e 12 - Listar todos os treinos
app.get('/treinos', (req, res) => {
    let sql = 'SELECT * FROM treinos';
    const condicoes = [];
    const valores = [];

    if (req.query.minimo !== undefined) {
        const minimo = Number(req.query.minimo);
        if (Number.isNaN(minimo)) {
            return res.status(400).json({ erro: 'O parametro minimo deve ser um numero.' });
        }
        condicoes.push('duracao >= ?');
        valores.push(minimo);
    }

    if (req.query.busca !== undefined) {
        condicoes.push('nome LIKE ?');
        valores.push(`%${req.query.busca}%`);
    }

    if (condicoes.length > 0) {
        sql += ' WHERE ' + condicoes.join(' AND ');
    }

    sql += ' ORDER BY duracao DESC';

    const treinos = db.prepare(sql).all(...valores);
    res.status(200).json(treinos);
});

// ROTA 4 e 5 - Buscar treino por ID
app.get('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo.' });
    }

    const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);

    if (!treino) {
        return res.status(404).json({ erro: 'Treino não encontrado.' });
    }

    res.status(200).json(treino);
});

app.put('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);
    const corpo = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo.' });
    }

    const erroValidacao = validarTreino(corpo);
    if (erroValidacao) {
        return res.status(400).json({ erro: erroValidacao });
    }

    // Verifica se o treino existe antes de atualizar
    const treinoExistente = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    if (!treinoExistente) {
        return res.status(404).json({ erro: 'Treino não encontrado.' });
    }

    const atualizar = db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?');
    atualizar.run(corpo.nome, corpo.duracao, id);

    res.status(200).json({ id, nome: corpo.nome, duracao: corpo.duracao });
});

app.delete('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'O id deve ser um número inteiro positivo.' });
    }

    const treinoExistente = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    if (!treinoExistente) {
        return res.status(404).json({ erro: 'Treino não encontrado.' });
    }

    const deletar = db.prepare('DELETE FROM treinos WHERE id = ?');
    deletar.run(id);

    res.status(204).send();
});

app.get('/treinos/total', (req, res) => {
    const resultado = db.prepare('SELECT COUNT(*) AS total FROM treinos').get();
    res.status(200).json(resultado);
});

app.get('/treinos/resumo', (req, res) => {
    const resumo = db.prepare(`
        SELECT
            COUNT (*) AS total,
            COALESCE(SUM(duracao), 0) AS minutos,
            COALESCE(AVG(duracao), 0) AS media
        FROM treinos
    `).get()
    res.status(200).json(resumo);
});

const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor ligado em http://localhost:${porta}`)
});
