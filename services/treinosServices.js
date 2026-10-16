const repository = require('api-treinos/repositories/treinosRepository.js')

function validarTreino(corpo){
    if(typeof corpo.nome !== 'string' || corpo.nome.trim() === ''){
        return 'O campo nome eh obrigatorio e deve ser um numero maior que zero.';
    }
    if(typeof corpo.duracao !== 'number' || corpo.duracao <= 0){
        return 'O campo duracao eh obrigatorio e deve ser um numero maior que zero.';
    }
    return null;
}

function limparTodos(){
    return repository.limparTodos();
}