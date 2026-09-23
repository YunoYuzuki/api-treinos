const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('treinos.db');
const express = require('express');

const app = express();

db.exec(`
    CREATE TABLE IF NOT EXISTS treinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        duracao INTEGER NOT NULL
    )
`);

function validarTreino(corpo){
    if(typeof corpo.nome !== 'string' || corpo.nome.trim() === ''){
        return 'O campo nome eh obrigatorio e deve ser um texto.';
    }
    if(typeof corpo.duracao !== 'number' || corpo.duracao <= 0){
        return 'O campo duracao eh obrigatorio e deve ser um numero maior que zero.';
    }
    return null;
}

const inserir = db.prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)');
inserir.run('Costas', 60);
inserir.run('Peito', 45);
inserir.run('Perna', 70);
inserir.run('Triceps', 30);
inserir.run('Biceps', 30);
inserir.run('Ombro', 40);

app.get('/treinos/total', (req, res) => {
    const resultado = db.prepare('SELECT COUNT(*) AS total FROM treinos').get();
    res.status(200).json(resultado);
})

app.get('/treinos/resumo', (req, res) => {
    const resumo = db.prepare(`
        SELECT
            COUNT (*) AS total,
            COALESCE(SUM(duracao), 0) AS minutos,
            COALESCE(AVG(duracao), 0) AS media
        FROM treinos
    `).get()
    res.status(200).json(resumo);
})

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
        valores.push(`%${req.query.busca}%`); // o % vai no valor, nunca no SQL
    }

    if (condicoes.length > 0) {
        sql += ' WHERE ' + condicoes.join(' AND ');
    }

    sql += ' ORDER BY duracao DESC'; // maior para a menor

    const treinos = db.prepare(sql).all(...valores);
    res.status(200).json(treinos);
});

const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor ligado em http://localhost:${porta}`)
});