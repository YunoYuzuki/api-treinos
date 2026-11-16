Tadeu, seu repositório está em 1,7 de 2,5, e essa nota não está fechada: você tem mais prazo para corrigir e subir. Leia até o fim, porque a última parte é o roteiro do que fazer, na ordem que mais rende nota. No fechamento a nota era 1,1, e subiu depois que você arrumou a porta em 12/11. Abaixo está, aula por aula, quanto passou e o motivo de cada falha.

O que derrubou tudo no começo foram duas coisas no `servidor.js`, e nenhuma delas tem a ver com a lógica das aulas. Primeiro, as rotas foram escritas com espaço no caminho (`/ treinos /: id`), e o Express não aceita isso: ele recusa a rota e o servidor nem sobe. Depois, quando você corrigiu os espaços no commit cff11d4, de 30/10, a porta passou a ser 3001, e o enunciado e os testes usam a 3000. Servidor em porta errada é o mesmo que servidor desligado para quem testa de fora. Por isso aulas que você já tinha escrito apareciam como zero. Em 12/11 você trocou o 3001 por 3000, um caractere, e quatro aulas passaram a pontuar de uma vez. Guarda esse episódio: não era o seu código que estava errado, era o endereço.

Aula 2, 9 de 10. Falha o PUT: ele devolve 400 mesmo quando o treino é válido. O motivo está no `atualizar`, no `controllers/treinosController.js`. Depois de checar o `naoEncontrado`, você escreveu `if(resultado !== undefined)` para decidir o 400. O `resultado` é sempre um objeto, então essa condição é sempre verdadeira e a função sai pelo 400 antes de chegar no 200. Compare com o seu `criar`, dez linhas acima, que testa `resultado.erro !== undefined`: é essa a checagem que falta aqui.

Aula 3, 6 de 7 testes e 0 de 3 exercícios. O teste que falha é o mesmo PUT da aula 2, pelo mesmo motivo. A migração para SQLite em si está certa, o `banco.js` cria as tabelas e o `treinosRepository.js` usa SQL com `WHERE id = ?`. Os 3 exercícios da aula não foram feitos: falta o `GET /treinos/total`, o filtro `?minimo=` e a ordenação do maior para o menor.

Aula 4, 5 de 8 testes, e a regra dos 180 minutos não entrou. A separação em camadas está feita e passou: `banco.js` exporta a conexão, existem `controllers/`, `services/` e `repositories/`, o `servidor.js` não tem mais SQL e as camadas não se misturam. O que falha: o `teste-banco2.js` e o `teste-service.js` não existem no repositório, são dois arquivos que a aula pedia para você criar e rodar com `node`; e o teste de contrato do CRUD cai pelo PUT, de novo o mesmo `if`. A regra de não aceitar treino com mais de 180 minutos deveria estar dentro do `validarTreino`, no `treinosServices.js`, e não está em nenhum lugar.

Aula 5, 4 de 8. O `sessoes.js` está certo, com um Map guardando o id do usuário por token: essa era a parte mais difícil da aula e você acertou. O login funciona, e o `/perfil` sem login responde 401 como deveria. O que falha são o perfil com cookie, o logout e o teste das duas sessões ao mesmo tempo, e os três caem pelo mesmo motivo. No `usuarioDaRequisicao`, no `controllers/authController.js`, você lê o token do cookie e logo em seguida chama `usuariosRepository.buscarPorId(id)`, só que `id` não existe nessa função: em nenhum momento o token é trocado pelo id do usuário. Falta usar a função que você mesmo escreveu no `sessoes.js`. Como está, a chamada quebra com erro e o servidor responde 500 em vez de devolver o usuário. A quarta falha é outra: nenhuma rota de treino exige login. O `servidor.js` manda `/treinos` direto para o controller, sem nada checando a sessão antes, então quem não está logado consegue mexer nos treinos.

Aula 6, 3 de 10, não começou. O `bcrypt` não está no `package.json`, não existe `criarUsuarios.js`, o `banco.js` ainda cria a tabela de usuários com a coluna `senha` e grava `1234` e `senha` como texto, e o `authServices.js` compara com `encontrado.senha !== senha`. Os 3 testes que passam são os que a aula 6 herda da aula 5. O `testes.http` também não tem nenhuma requisição de login, perfil ou logout.

Duas coisas que não tiram nota mas vale arrumar: o `repositories/treinosRepository.js` começa com `require('express')` e cria um `app` que não é usado, e repositório é justamente a camada que não deve saber que existe HTTP, que é o ponto da aula 4; e a mensagem de erro do campo nome diz que ele deve ser um número maior que zero, texto copiado da validação da duração.

Agora o roteiro. Faz na ordem abaixo, do que rende mais para o que rende menos, e vai subindo commit a cada item que funcionar. Não precisa refazer nada do zero nem voltar atrás no histórico: tudo o que está descrito aqui se arruma no código que já está no seu repositório hoje.

Primeiro, o `if` do `atualizar`, no `controllers/treinosController.js`. É uma linha. Isso devolve o PUT e conserta de uma vez a aula 2, a aula 3 e o teste de contrato da aula 4.

Segundo, o `usuarioDaRequisicao`, no `controllers/authController.js`. Falta uma linha, trocando o token pelo id antes de buscar o usuário. O `sessoes.js` já tem a função que faz isso. Isso devolve três testes da aula 5.

Esses dois itens somados são duas linhas e levam seu repositório de 1,7 para cerca de 2,2. Eu rodei os testes com essas duas correções aplicadas para conferir: aula 2 vai a 10 de 10, aula 3 a 7 de 7, aula 4 a 6 de 8 e aula 5 a 7 de 8.

Terceiro, criar o `teste-banco2.js` e o `teste-service.js`, que são os dois arquivos de teste que a aula 4 pedia, e rodar cada um com `node` para ver se termina sem erro.

Quarto, a regra dos 180 minutos dentro do `validarTreino`, no `treinosServices.js`. É um `if` igual aos dois que já estão ali.

Quinto, exigir login nas rotas de treino, no `servidor.js`. Isso fecha a aula 5.

Sexto, os 3 exercícios da aula 3, que são três rotas novas no mesmo padrão das que você já fez.

Sétimo, a aula 6 inteira, que é a que vale mais e está zerada: instalar o `bcrypt`, escrever o `criarUsuarios.js` gerando o hash, trocar a coluna `senha` por `senha_hash` no `banco.js`, usar `await bcrypt.compare` no `authServices.js` e completar o `testes.http` com login, perfil, logout, senha errada e duas sessões.

Antes de cada commit, roda os testes. Se ficarem vermelhos, o commit anterior era melhor: não sobe por cima.

Se tiver dúvida, fala na próxima aula.
