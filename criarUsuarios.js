const bcrypt = require('bcrypt');
const db = require('./banco.js');

async function criarUsuarioDeTeste(){
    const senhaDiego = await bcrypt.hash('1234', 10);
    const senhaAluno = await bcrypt.hash('senha', 10);

    const inserir = db.prepare(
        'INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)'
    );

    inserir.run('diego', senhaDiego);
    inserir.run('aluno', senhaAluno);
}

criarUsuarioDeTeste()
    .then(() => console.log('Usuários criados com hash'))
    .catch((erro) => {
        console.error('Não foi possível criar usuários: ', erro);
        process.exitCode = 1;
    });