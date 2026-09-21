const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('treinos.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS treinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        duracao INTEGER NOT NULL
    )
`);

db.prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
    .run('Costas', 10);

console.log(db.prepare('SELECT * FROM treinos').all());

app.get('/treinos', (req, res) => {
    const id = Number(res.params.id);
    const treino = db.prepare('SELECT * FROM treinos');

    if(treino === undefined){
        return res.status(404).json({ erro : 'Treino nao encontrado'});
    }
    res.status(200).json(treino);
})

const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor)
})