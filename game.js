// ====== LISTA PADRONIZADA (0 a 100%) ======
const listaMissoesPadrao = [
  // Carreira
  { id: 1, cat: "Carreira & Estudos", titulo: "Pós-Graduação Concluída", atual: 0, meta: 100, unidade: "%" },
  { id: 2, cat: "Carreira & Estudos", titulo: "Nota Alta no Enem", atual: 0, meta: 100, unidade: "%" },
  { id: 3, cat: "Carreira & Estudos", titulo: "Eng. Elétrica IFSP (Processo)", atual: 0, meta: 100, unidade: "%" },
  { id: 4, cat: "Carreira & Estudos", titulo: "Efetivação ISA Energia", atual: 0, meta: 100, unidade: "%" },
  { id: 5, cat: "Carreira & Estudos", titulo: "Registro Eletrotécnico", atual: 0, meta: 100, unidade: "%" },
  { id: 6, cat: "Carreira & Estudos", titulo: "Dominar Mat/Fís/Elé", atual: 0, meta: 100, unidade: "%" },
  { id: 7, cat: "Carreira & Estudos", titulo: "Poliglota (4 Idiomas)", atual: 0, meta: 100, unidade: "%" },
  { id: 8, cat: "Carreira & Estudos", titulo: "Inglês C2 (Fluência)", atual: 0, meta: 100, unidade: "%" },
  
  // Saúde
  { id: 9, cat: "Saúde & Físico", titulo: "Pressão/Glicemia Estabilizadas", atual: 0, meta: 100, unidade: "%" },
  { id: 10, cat: "Saúde & Físico", titulo: "Peso Ideal (1.75m / 38 anos)", atual: 0, meta: 100, unidade: "%" },
  { id: 11, cat: "Saúde & Físico", titulo: "Aprender a Nadar", atual: 0, meta: 100, unidade: "%" },

  // Habilidades
  { id: 12, cat: "Habilidades & Lazer", titulo: "Aprender Cavaquinho", atual: 0, meta: 100, unidade: "%" },
  { id: 13, cat: "Habilidades & Lazer", titulo: "Meta Leitura Anual", atual: 0, meta: 100, unidade: "%" },
  { id: 14, cat: "Habilidades & Lazer", titulo: "Viajar para Outro País", atual: 0, meta: 100, unidade: "%" },
  { id: 15, cat: "Habilidades & Lazer", titulo: "Conhecer 4 Maravilhas", atual: 0, meta: 100, unidade: "%" },

  // Financeiro
  { id: 16, cat: "Financeiro & Bens", titulo: "Limpar o Nome", atual: 0, meta: 100, unidade: "%" },
  { id: 17, cat: "Financeiro & Bens", titulo: "Meta Salarial (10k)", atual: 0, meta: 100, unidade: "%" },
  { id: 18, cat: "Financeiro & Bens", titulo: "Juntar 1 Milhão", atual: 0, meta: 100, unidade: "%" },
  { id: 19, cat: "Financeiro & Bens", titulo: "Comprar Casa Própria", atual: 0, meta: 100, unidade: "%" },
  { id: 20, cat: "Financeiro & Bens", titulo: "Comprar Casa na Praia", atual: 0, meta: 100, unidade: "%" },
  { id: 21, cat: "Financeiro & Bens", titulo: "Comprar Moto", atual: 0, meta: 100, unidade: "%" },
  { id: 22, cat: "Financeiro & Bens", titulo: "Comprar Carro Automático", atual: 0, meta: 100, unidade: "%" },
  { id: 23, cat: "Financeiro & Bens", titulo: "Casar", atual: 0, meta: 100, unidade: "%" },
];

const inputIds = ["pressao", "glicemia", "sono", "treino", "cardio", "estudo", "exercicios", "leitura", "idioma"];

// ====== INICIALIZAÇÃO ======
let progresso = JSON.parse(localStorage.getItem("lifeRPG")) || {
  xpTotal: 0,
  nivel: 1,
  historico: [],
  missoes: JSON.parse(JSON.stringify(listaMissoesPadrao))
};

// Se faltar missões (ou reset), carrega padrão
if (!progresso.missoes || progresso.missoes.length === 0) {
    progresso.missoes = JSON.parse(JSON.stringify(listaMissoesPadrao));
}

function salvar() {
    localStorage.setItem("lifeRPG", JSON.stringify(progresso));
    atualizarInterface();
}

function abrirTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    const botoes = document.querySelectorAll('.tab-btn');
    if(tabId === 'tab-status') botoes[0].classList.add('active');
    if(tabId === 'tab-missoes') botoes[1].classList.add('active');
    if(tabId === 'tab-diario') botoes[2].classList.add('active');
}

// ====== INTERFACE ======
function calcularNivel() {
    progresso.nivel = Math.floor(progresso.xpTotal / 1000) + 1;
}

function atualizarInterface() {
    calcularNivel();
    
    const xpBanner = document.getElementById("banner-xp");
    const nivelDisplay = document.getElementById("nivel-display");
    if(xpBanner) xpBanner.innerText = `XP: ${progresso.xpTotal}`;
    if(nivelDisplay) nivelDisplay.innerText = `NÍVEL ${progresso.nivel}`;

    // === HISTÓRICO COM DETALHES ===
    const listaHistorico = document.getElementById("lista-historico");
    if(listaHistorico) {
        let html = "";
        if(!progresso.historico) progresso.historico = [];
        
        progresso.historico.forEach((dia, index) => {
            let cor = dia.xp >= 0 ? "#4ade80" : "#f87171";
            let det = dia.detalhes || {}; // Pega detalhes ou vazio

            html += `
            <div class="historico-item">
                <div class="historico-cabecalho">
                    <span style="color: #fff; font-weight:bold;">${dia.data}</span>
                    <span style="color: ${cor}; font-weight: bold;">${dia.xp} XP</span>
                    <button onclick="deletarItem(${index})" class="btn-lixeira">🗑️</button>
                </div>
                
                <div class="historico-detalhes">
                    <span>🩺 Pressão: <b style="color:#fff">${det.pressao || '-'}</b></span>
                    <span>🩸 Glicemia: <b style="color:#fff">${det.glicemia || '-'}</b></span>
                    <span>😴 Sono: <b style="color:#fff">${det.sono || '-'}h</b></span>
                    <span>🏋️ Treino: <b style="color:#fff">${det.treino || '-'}</b></span>
                    <span>🏃 Cardio: <b style="color:#fff">${det.cardio || '-'}min</b></span>
                    <span>🧠 Estudo: <b style="color:#fff">${det.estudo || '-'}min</b></span>
                    <span>📐 Exer.: <b style="color:#fff">${det.exercicios || '-'}</b></span>
                    <span>📚 Ler: <b style="color:#fff">${det.leitura || '-'}min</b></span>
                    <span>🗣️ Idioma: <b style="color:#fff">${det.idioma || '-'}min</b></span>
                </div>
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
    
    if(!progresso.missoes) progresso.missoes = [];

    progresso.missoes.forEach((missao, index) => {
        if (missao.cat !== categoriaAtual) {
            categoriaAtual = missao.cat;
            html += `<div class="categoria-titulo">${categoriaAtual}</div>`;
        }
        
        // Garante limite visual 100%
        let porcentagem = missao.atual;
        if (porcentagem > 100) porcentagem = 100;

        html += `
        <div class="missao-card">
            <div class="missao-header">
                <span>${missao.titulo}</span>
                <span>${missao.atual}%</span>
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

// ====== AÇÕES ======

function alterarProgresso(index, valor) {
    let missao = progresso.missoes[index];
    
    // Incremento FIXO de 5%
    missao.atual += (valor * 5);

    // Limites (0 a 100)
    if (missao.atual < 0) missao.atual = 0;
    if (missao.atual > 100) missao.atual = 100;
    
    salvar();
}

function adicionarMissao() {
    const cat = document.getElementById("nova-cat").value;
    const tit = document.getElementById("nova-titulo").value;

    if(!cat || !tit) {
        alert("Preencha Categoria e Título!");
        return;
    }

    progresso.missoes.push({
        id: Date.now(),
        cat: cat,
        titulo: tit,
        atual: 0,
        meta: 100,     // Padrão
        unidade: "%"   // Padrão
    });

    document.getElementById("nova-cat").value = "";
    document.getElementById("nova-titulo").value = "";
    alert("Missão adicionada!");
    salvar();
}

function calcularXP() {
    const msgErro = document.getElementById("msg-erro");
    msgErro.innerHTML = "";
    const hoje = new Date().toLocaleDateString("pt-BR");
    
    if (progresso.historico.some(dia => dia.data === hoje)) {
        msgErro.innerHTML = "⚠️ Você já calculou hoje!";
        return;
    }

    // CAPTURA VALORES PARA O HISTÓRICO
    const vPressao = document.getElementById("pressao").value;
    const vGlicemia = document.getElementById("glicemia").value;
    const vSono = document.getElementById("sono").value;
    const vTreino = document.getElementById("treino").value;
    const vCardio = document.getElementById("cardio").value;
    const vEstudo = document.getElementById("estudo").value;
    const vExercicios = document.getElementById("exercicios").value;
    const vLeitura = document.getElementById("leitura").value;
    const vIdioma = document.getElementById("idioma").value;

    for (let id of inputIds) {
        if (!document.getElementById(id).value) {
            msgErro.innerHTML = "⚠️ Preencha todos os campos!";
            return;
        }
    }

    let xp = 0;
    // Cálculo XP
    const pressao = Number(vPressao);
    if (pressao === 11) xp += 50; else if (pressao === 12) xp += 30; else if (pressao === 13) xp += 10; else if (pressao >= 14) xp -= 30;
    
    const glicemia = Number(vGlicemia);
    if (glicemia < 99) xp += 50; else if (glicemia <= 149) xp += 30; else if (glicemia === 150) xp += 10; else if (glicemia > 150) xp -= 30;
    
    xp += vTreino === "sim" ? 50 : -30;
    
    const cardio = Number(vCardio);
    if (cardio >= 30 && cardio <= 59) xp += 50; else if (cardio >= 60) xp += 100; else xp -= 30;
    
    const sono = Number(vSono);
    if (sono >= 5 && sono <= 7) xp += 50; else if (sono > 7) xp += 100; else xp -= 30;
    
    const estudo = Number(vEstudo);
    if (estudo >= 30 && estudo <= 60) xp += 50; else if (estudo > 60) xp += 100; else xp -= 30;
    
    const exercicios = Number(vExercicios);
    if (exercicios >= 5 && exercicios <= 10) xp += 50; else if (exercicios > 10) xp += 100; else xp -= 30;
    
    const leitura = Number(vLeitura);
    if (leitura >= 15 && leitura <= 30) xp += 50; else if (leitura > 30) xp += 100; else xp -= 30;
    
    const idioma = Number(vIdioma);
    if (idioma >= 30 && idioma <= 60) xp += 50; else if (idioma > 60) xp += 100; else xp -= 30;

    let status = "NORMAL";
    if (xp >= 400) status = "ELITE 🔥";
    else if (xp >= 250) status = "EVOLUINDO 🚀";
    else if (xp < 100) status = "CRÍTICO 💀";

    progresso.xpTotal += xp;
    
    // SALVA NO HISTÓRICO COM DETALHES
    progresso.historico.unshift({
        data: hoje,
        xp: xp,
        status: status,
        detalhes: {
            pressao: vPressao,
            glicemia: vGlicemia,
            sono: vSono,
            treino: vTreino,
            cardio: vCardio,
            estudo: vEstudo,
            exercicios: vExercicios,
            leitura: vLeitura,
            idioma: vIdioma
        }
    });
    
    if (progresso.historico.length > 30) progresso.historico.pop();

    const divResultado = document.getElementById("resultado");
    divResultado.style.display = "block";
    divResultado.innerHTML = `<h2>RESULTADO</h2><span>${xp} XP</span><br>${status}`;
    
    salvar();
}

function deletarItem(index) {
    if(confirm("Apagar registro?")) {
        progresso.xpTotal -= progresso.historico[index].xp;
        progresso.historico.splice(index, 1);
        salvar();
    }
}

function resetarDados() {
    if(confirm("⚠️ APAGAR TUDO?")) {
        localStorage.removeItem("lifeRPG");
        location.reload();
    }
}

function exportarDados() {
    const dados = JSON.stringify(progresso);
    navigator.clipboard.writeText(dados).then(() => {
        alert("✅ DADOS COPIADOS!");
    }).catch(err => prompt("Copie:", dados));
}

function importarDados() {
    const dados = prompt("Cole aqui:");
    if (dados) {
        try {
            const json = JSON.parse(dados);
            if (json.xpTotal !== undefined) {
                progresso = json;
                salvar();
                alert("✅ Carregado!");
            }
        } catch (e) { alert("❌ Erro."); }
    }
}

atualizarInterface();
