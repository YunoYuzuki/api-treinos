const app = express();
const db = require('api-treinos/banco.js')

function listarTodos(){
    return db.prepare('SELECT * FROM treinos').all();
}

function buscarPorId(id){
    return db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
}

function criar(nome, duracao){
    const resultado = db
        .prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
        .run(nome, duracao);
    return buscarPorId(id);
}

function atualizar(id, nome, duracao){
    db.prepare('UPDATE treinos SET nome = ?, ')
}