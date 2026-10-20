# Super-Heróis Digitais · TIC 4.º ano

Aplicação de atividades práticas sobre ergonomia e uso responsável das tecnologias.

- **`index.html`**: página dos alunos. Não precisam de conta nem de palavra-passe.
- **`professor.html`**: painel do professor, para ver os resultados, abrir missões, ver cartazes e validar.

## O que faz a base de dados

| Ação | Onde |
|---|---|
| O aluno escreve o nome e escolhe a turma | Aparece logo no painel do professor |
| O aluno termina uma missão | As estrelas são guardadas no Firebase |
| O professor carrega num número em “Missões abertas” | As missões abrem em todos os computadores da turma ao mesmo tempo |
| O professor valida | O progresso é apagado automaticamente do computador do aluno; o registo fica no Firebase |

Se o Firebase não estiver configurado, ou não houver internet, a aplicação continua a funcionar só no computador, com as missões a abrir por ordem.

---

## 1. Criar o projeto Firebase

1. Vai a <https://console.firebase.google.com> e cria um projeto (por exemplo, `super-herois-epl`). O Google Analytics não é necessário.
2. Em **Criar > Firestore Database**, carrega em **Criar base de dados**, escolhe uma localização e começa em **modo de produção**.
3. Em **Criar > Authentication**, carrega em **Começar** e ativa dois métodos de início de sessão:
   - **Anónimo**: é assim que os alunos entram, sem darem por isso.
   - **Email/Palavra-passe**: só para ti.
4. Ainda em Authentication, separador **Utilizadores**, carrega em **Adicionar utilizador** e cria a tua conta de professor (o email e a palavra-passe que vais usar no painel). Depois copia o **UID** dessa conta.

## 2. Ligar a aplicação ao Firebase

1. Em **⚙️ Definições do projeto > Geral > As tuas apps**, carrega no ícone **Web (`</>`)** e regista a app (não é preciso o Firebase Hosting).
2. Copia os valores do objeto `firebaseConfig` para o ficheiro **`js/firebase-config.js`**.
3. No mesmo ficheiro, ajusta a lista de **turmas**.

## 3. Proteger a base de dados

1. Abre o ficheiro **`firestore.rules`** e substitui `COLOCA_AQUI_O_TEU_UID` pelo UID que copiaste.
2. Na consola, vai a **Firestore Database > Regras**, apaga o que lá está, cola o conteúdo do ficheiro e carrega em **Publicar**.

Com estas regras, os alunos só conseguem escrever no seu próprio registo e só tu consegues ver, validar e apagar os dados.

## 4. Pôr no GitHub Pages

1. Cria um repositório no GitHub (por exemplo, `super-herois-digitais`). No plano gratuito, tem de ser público. Os dados dos alunos não ficam no repositório, ficam no Firebase.
2. Envia todos os ficheiros desta pasta, mantendo a pasta `js`. No VS Code: abre a pasta, depois **Source Control > Publish to GitHub**.
3. No repositório, vai a **Settings > Pages**, escolhe **Deploy from a branch**, branch `main`, pasta `/ (root)`, e guarda.
4. Passado um minuto, a página fica em `https://O-TEU-UTILIZADOR.github.io/super-herois-digitais/`.

## 5. Autorizar o endereço no Firebase

Em **Authentication > Definições > Domínios autorizados**, adiciona `O-TEU-UTILIZADOR.github.io`. Sem este passo, os alunos não conseguem ligar-se.

## 6. Usar na aula

- **Alunos:** `https://O-TEU-UTILIZADOR.github.io/super-herois-digitais/`
- **Professor:** `https://O-TEU-UTILIZADOR.github.io/super-herois-digitais/professor.html`

No painel, escolhe a turma e carrega em **1. Postura** no início da aula. Vai abrindo as missões seguintes (2, 3, 4, 5) à medida que acabas cada explicação. No fim, valida os trabalhos: um a um, ou todos os que terminaram de uma só vez.

## Testar no teu computador

Os módulos JavaScript não funcionam se abrires o `index.html` com duplo clique. No VS Code, usa a extensão **Live Server** (botão “Go Live”). Para isso funcionar, adiciona `127.0.0.1` aos domínios autorizados do Firebase.

## Estrutura

```
index.html            página dos alunos
professor.html        painel do professor
estilo.css            aspeto das duas páginas
firestore.rules       regras de segurança (colar na consola Firebase)
js/firebase-config.js configuração e turmas  ← editar
js/comum.js           desenhos, mascote e cartaz
js/app.js             missões dos alunos
js/nuvem.js           ligação dos alunos ao Firebase
js/professor.js       painel do professor
```
