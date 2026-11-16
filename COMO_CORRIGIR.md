# Passo a passo para corrigir

Tadeu, segue o caminho na ordem. Faz um passo por vez e sobe um commit a cada passo que funcionar. Nada aqui pede para você voltar atrás no histórico nem refazer alguma aula do zero: tudo se arruma no código que já está no seu repositório hoje.

## Passo 0: pegar o que está no GitHub

Abre o terminal na pasta do projeto e roda:

```
git pull
```

Isso traz o feedback e este arquivo para a sua máquina.

## Passo 1: ligar o semáforo das aulas que você já fez

Abre o arquivo chamado `AULA`, na raiz do projeto. Hoje está escrito `03` nele. Esse número diz até qual aula o GitHub roda os testes a cada push, então o seu semáforo vinha testando só as aulas 2 e 3, e as aulas 4, 5 e 6 nunca apareciam. Troca o conteúdo por:

```
06
```

Só o número, nada mais, sem aspas e sem espaço. Salva.

## Passo 2: o PUT que devolve 400 sem motivo

Abre `controllers/treinosController.js` e acha a função `atualizar`. Lá tem esta linha:

```js
if(resultado !== undefined){
```

O `resultado` é sempre um objeto, então essa condição é sempre verdadeira e a função sai pelo 400 antes de chegar no `res.status(200)`. Olha a sua função `criar`, dez linhas acima: ela faz a checagem do jeito certo. Deixa igual:

```js
if(resultado.erro !== undefined){
```

Esse ajuste conserta o PUT na aula 2, na aula 3 e o teste de contrato da aula 4, tudo de uma vez.

## Passo 3: o perfil que não acha o usuário

Abre `controllers/authController.js` e acha a função `usuarioDaRequisicao`. Hoje ela está assim:

```js
function usuarioDaRequisicao(req){
    const token = lerCookie(req, 'sid');
    if(token === null) return null;

    return usuariosRepository.buscarPorId(id);
}
```

O `id` não existe nessa função, e por isso ela quebra: o servidor responde erro em vez de devolver o usuário. Falta o passo do meio, que é trocar o token pelo id do usuário. Quem faz isso é o seu `sessoes.js`, com a função `usuarioIdDaSessao`. Fica assim:

```js
function usuarioDaRequisicao(req){
    const token = lerCookie(req, 'sid');
    if(token === null) return null;

    const id = sessoes.usuarioIdDaSessao(token);
    if(id === undefined) return null;

    return usuariosRepository.buscarPorId(id);
}
```

Esse ajuste devolve três testes da aula 5: o perfil com cookie, o logout e o das duas sessões ao mesmo tempo.

## Passo 4: testar antes de subir

No terminal:

```
npm start
```

Com o servidor no ar, abre o `testes.http` e dispara, nesta ordem:

1. um `POST /treinos` criando um treino
2. um `PUT /treinos/1` mudando o nome e a duração desse treino, que agora tem que responder 200 com o treino alterado, e não 400
3. um `POST /login` com `{"usuario":"diego","senha":"1234"}`
4. um `GET /perfil`, que agora tem que responder 200 com o usuário, e não dar erro

Se os quatro responderem assim, os dois ajustes funcionaram.

## Passo 5: subir

```
git add -A
git commit -m "corrige o PUT e o perfil com cookie"
git push
```

## Passo 6: olhar o semáforo

Entra no seu repositório no GitHub e clica na aba Actions, ou na bolinha que aparece do lado do commit. Como você mudou o arquivo `AULA` para `06`, agora ele roda os testes das aulas 2 até a 6 e mostra, teste por teste, o que passou e o que falhou. Esse é o mesmo resultado que eu uso para dar a nota, então dali em diante você não precisa esperar por mim para saber onde está.

Com os passos 2 e 3 feitos, seu repositório sai de 1,7 para cerca de 2,2. Eu rodei os testes com esses dois ajustes aplicados para conferir: a aula 2 vai a 10 de 10, a aula 3 a 7 de 7, a aula 4 a 6 de 8 e a aula 5 a 7 de 8.

## Depois, se quiser subir mais

Na ordem de quanto rende:

1. Criar o `teste-banco2.js` e o `teste-service.js`, os dois arquivos de teste que a aula 4 pedia, e rodar cada um com `node nome-do-arquivo.js` para ver se termina sem erro.
2. A regra de não aceitar treino com mais de 180 minutos, dentro do `validarTreino`, no `treinosServices.js`. É um `if` no mesmo formato dos dois que já estão lá.
3. Exigir login nas rotas de treino, no `servidor.js`. Isso fecha a aula 5.
4. Os três exercícios da aula 3: o `GET /treinos/total`, o filtro `?minimo=` e a ordenação do maior para o menor.
5. A aula 6 inteira, que é a que vale mais e está zerada: instalar o `bcrypt`, escrever o `criarUsuarios.js` gerando o hash, trocar a coluna `senha` por `senha_hash` no `banco.js`, usar `await bcrypt.compare` no `authServices.js` e completar o `testes.http` com login, perfil, logout, senha errada e duas sessões.

Uma regra para levar daqui para frente: antes de cada commit, roda os testes. Se ficarem vermelhos, o commit anterior era melhor, então não sobe por cima.

Se tiver dúvida, fala na próxima aula.
