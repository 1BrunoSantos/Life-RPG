// ====== IMPORTAR O FIREBASE (Cérebro na Nuvem) ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ====== SUA CONFIGURAÇÃO (Corrigida) ======
const firebaseConfig = {
  apiKey: "AIzaSyDjO76UYBeyJSTaflS702NOEeAqcwKgNW4",
  authDomain: "life-rpg-7f7bc.firebaseapp.com",
  projectId: "life-rpg-7f7bc",
  storageBucket: "life-rpg-7f7bc.firebasestorage.app",
  messagingSenderId: "61808715622",
  appId: "1:61808715622:web:885bc37083f63438550aa7"
};

// Iniciar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, 'jogador_alex'); // Nome da sua pasta na nuvem

// ====== CONFIGURAÇÃO DAS MISSÕES ======
const listaMissoes = [
  { id: 1, cat: "Carreira & Estudos", titulo: "Pós-Graduação Concluída", atual: 0, meta: 100, unidade: "%" },
  { id: 2, cat: "Carreira & Estudos", titulo: "Nota Alta no Enem", atual: 0, meta: 900, unidade: "pts" },
  { id: 3, cat: "Carreira & Estudos", titulo: "Eng. Elétrica IFSP (Entrar)", atual: 0, meta: 1, unidade: "check" },
  { id: 4, cat: "Carreira & Estudos", titulo: "Efetivação ISA Energia", atual: 0, meta: 1, unidade: "check" },
  { id: 5, cat: "Carreira & Estudos", titulo: "Registro Eletrotécnico", atual: 0, meta: 1, unidade: "check" },
  { id: 6, cat: "Carreira & Estudos", titulo: "Dominar Matemática/Física/Elétrica", atual: 0, meta: 100, unidade: "%" },
  { id: 7, cat: "Carreira & Estudos", titulo: "Poliglota (4 Idiomas)", atual: 0, meta: 4, unidade: "idiomas" },
  { id: 8, cat: "Carreira & Estudos", titulo: "Inglês C2 (Fluência)", atual: 0, meta: 100, unidade: "%" },
  { id: 9, cat: "Saúde & Físico", titulo: "Pressão/Glicemia Estabilizadas", atual: 0, meta: 100, unidade: "%" },
  { id: 10, cat: "Saúde & Físico", titulo: "Peso Ideal (1.75m / 38 anos)", atual: 0, meta: 100, unidade: "%" },
  { id: 11, cat: "Saúde & Físico", titulo: "Aprender a Nadar", atual: 0, meta: 100, unidade: "%" },
  { id: 12, cat: "Habilidades & Lazer", titulo: "Aprender Cavaquinho", atual: 0, meta: 100, unidade: "%" },
  { id: 13, cat: "Habilidades & Lazer", titulo: "Ler 1 Livro por Mês", atual: 0, meta: 12, unidade: "livros/ano" },
  { id: 14, cat: "Habilidades & Lazer", titulo: "Viajar para Outro País", atual: 0, meta: 1, unidade: "check" },
  { id: 15, cat: "Habilidades & Lazer", titulo: "Conhecer 4 Maravilhas do Mundo", atual: 0, meta: 4, unidade: "locais" },
  { id: 16, cat: "Financeiro & Bens", titulo: "Limpar o Nome", atual: 0, meta: 100, unidade: "%" },
  { id: 17, cat: "Financeiro & Bens", titulo: "Salário de 10k/mês", atual: 0, meta: 10000, unidade: "R$" },
  { id: 18, cat: "Financeiro & Bens", titulo: "Juntar 1 Milhão", atual: 0, meta: 100, unidade: "%" },
  { id: 19, cat: "Financeiro & Bens", titulo: "Comprar Casa Própria", atual: 0, meta: 1, unidade: "check" },
  { id: 20, cat: "Financeiro & Bens", titulo: "Comprar Casa na Praia", atual: 0, meta: 1, unidade: "check" },
  { id: 21, cat: "Financeiro & Bens", titulo: "Comprar Moto", atual: 0, meta: 1, unidade: "check" },
  { id: 22, cat: "Financeiro & Bens", titulo: "Comprar Carro Automático", atual: 0, meta: 1, unidade: "check" },
  { id: 23, cat: "Financeiro & Bens", titulo: "Casar", atual: 0, meta: 1, unidade: "check" },
];

let progresso = {
  xpTotal: 0,
  nivel: 1,
  historico: [],
  missoes: listaMissoes
};

const inputIds = ["pressao", "glicemia", "sono", "treino", "cardio", "estudo", "exercicios", "leitura", "idioma"];

// ====== SINCRONIZAÇÃO EM TEMPO REAL ======
// Assim que abrir o jogo, ele "ouve" o banco de dados.
onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    progresso = data;
    // Se novas missões foram adicionadas no código mas não estão no banco, mescla:
    if(!progresso.missoes || progresso.missoes.length < listaMissoes.length) {
        progresso.missoes = listaMissoes;
    }
  }
  atualizarInterface();
});

function salvar() {
  // Envia para a nuvem
  set(dbRef, progresso);
}

// === SISTEMA DE ABAS ===
window.abrirTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    const botoes = document.querySelectorAll('.tab-btn');
    if(tabId === 'tab-status') botoes[0].classList.add('active');
    if(tabId === 'tab-missoes') botoes[1].classList.add('active');
    if(tabId === 'tab-diario') botoes[2].classList.add('active');
}

function calcularNivel() {
    progresso.nivel = Math.floor(progresso.xpTotal / 1000) + 1;
}

function atualizarInterface() {
  calcularNivel();
  document.getElementById("banner-xp").innerText = `XP: ${progresso.xpTotal}`;
  document.getElementById("nivel-display").innerText = `NÍVEL ${progresso.nivel}`;

  const listaHistorico = document.getElementById("lista-historico");
  if(listaHistorico) {
      let html = "";
      if(!progresso.historico) progresso.historico = [];
      
      progresso.historico.forEach((dia, index) => {
        let cor = dia.xp >= 0 ? "#4ade80" : "#f87171";
        html += `
          <div class="historico-item">
            <div class="dados-dia">
                <span style="color: #94a3b8;">${dia.data}</span>
                <span style="color: ${cor}; font-weight: bold;">${dia.xp} XP</span>
                <span style="font-size: 12px; opacity: 0.8; border: 1px solid #334155; padding: 2px 6px; border-radius: 4px;">${dia.status}</span>
            </div>
            <button onclick="deletarItem(${index})" class="btn-lixeira">🗑️</button>
          </div>`;
      });
      listaHistorico.innerHTML = html;
  }
  renderizarMissoes();
}

function renderizarMissoes() {
    const container = document.getElementById("container-missoes");
    if(!container) return;

    let html = "";
    let categoriaAtual = "";

    progresso.missoes.forEach((missao, index) => {
        if (missao.cat !== categoriaAtual) {
            categoriaAtual = missao.cat;
            html += `<div class="categoria-titulo">${categoriaAtual}</div>`;
        }
        let porcentagem = (missao.atual / missao.meta) * 100;
        if (porcentagem > 100) porcentagem = 100;

        html += `
        <div class="missao-card">
            <div class="missao-header">
                <span>${missao.titulo}</span>
                <span>${missao.atual} / ${missao.meta} ${missao.unidade}</span>
            </div>
            <div class="barra-fundo">
                <div class="barra-progresso" style="width: ${porcentagem}%"></div>
            </div>
            <div class="botoes-progresso">
                <button class="btn-small" onclick="alterarProgresso(${index}, -1)">-</button>
                <button class="btn-small" onclick="alterarProgresso(${index}, 1)">+</button>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}

window.alterarProgresso = function(index, valor) {
    let missao = progresso.missoes[index];
    let incremento = 1;
    if (missao.meta >= 1000) incremento = 100; 
    else if (missao.meta >= 100) incremento = 5;

    missao.atual += (valor * incremento);
    if (missao.atual < 0) missao.atual = 0;
    if (missao.atual > missao.meta) missao.atual = missao.meta;
    salvar();
}

window.calcularXP = function() {
  const msgErro = document.getElementById("msg-erro");
  msgErro.innerHTML = "";
  
  if(!progresso.historico) progresso.historico = [];

  const hoje = new Date().toLocaleDateString("pt-BR");
  if (progresso.historico.some(dia => dia.data === hoje)) {
    msgErro.innerHTML = "⚠️ Já calculou hoje!";
    return;
  }

  for (let id of inputIds) {
    if (!document.getElementById(id).value) {
      msgErro.innerHTML = "⚠️ Preencha tudo!";
      return;
    }
  }

  let xp = 0;
  // Lógica de cálculo
  const pressao = Number(document.getElementById("pressao").value);
  if (pressao === 11) xp += 50; else if (pressao === 12) xp += 30; else if (pressao === 13) xp += 10; else if (pressao >= 14) xp -= 30;
  const glicemia = Number(document.getElementById("glicemia").value);
  if (glicemia < 99) xp += 50; else if (glicemia <= 149) xp += 30; else if (glicemia === 150) xp += 10; else if (glicemia > 150) xp -= 30;
  xp += document.getElementById("treino").value === "sim" ? 50 : -30;
  const cardio = Number(document.getElementById("cardio").value);
  if (cardio >= 30 && cardio <= 59) xp += 50; else if (cardio >= 60) xp += 100; else xp -= 30;
  const sono = Number(document.getElementById("sono").value);
  if (sono >= 5 && sono <= 7) xp += 50; else if (sono > 7) xp += 100; else xp -= 30;
  const estudo = Number(document.getElementById("estudo").value);
  if (estudo >= 30 && estudo <= 60) xp += 50; else if (estudo > 60) xp += 100; else xp -= 30;
  const exercicios = Number(document.getElementById("exercicios").value);
  if (exercicios >= 5 && exercicios <= 10) xp += 50; else if (exercicios > 10) xp += 100; else xp -= 30;
  const leitura = Number(document.getElementById("leitura").value);
  if (leitura >= 15 && leitura <= 30) xp += 50; else if (leitura > 30) xp += 100; else xp -= 30;
  const idioma = Number(document.getElementById("idioma").value);
  if (idioma >= 30 && idioma <= 60) xp += 50; else if (idioma > 60) xp += 100; else xp -= 30;

  let status = "NORMAL";
  if (xp >= 400) status = "ELITE 🔥";
  else if (xp >= 250) status = "EVOLUINDO 🚀";
  else if (xp < 100) status = "CRÍTICO 💀";

  progresso.xpTotal += xp;
  progresso.historico.unshift({ data: hoje, xp: xp, status: status });
  if (progresso.historico.length > 30) progresso.historico.pop();

  document.getElementById("resultado").style.display = "block";
  document.getElementById("resultado").innerHTML = `<h2>RESULTADO</h2><span>${xp} XP</span><br>${status}`;
  
  salvar();
}

window.deletarItem = function(index) {
    if(confirm("Apagar registro?")) {
        progresso.xpTotal -= progresso.historico[index].xp;
        progresso.historico.splice(index, 1);
        salvar();
    }
}

window.resetarDados = function() {
  if (confirm("⚠️ APAGAR TUDO DO SERVIDOR?")) {
    set(dbRef, null);
    location.reload();
  }
}