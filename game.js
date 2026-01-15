// ====== STANDARDIZED QUEST LIST (English) ======
const listaMissoesPadrao = [
  { id: 1, cat: "Career & Studies", titulo: "Finish Postgraduate Degree", atual: 0, meta: 100, unidade: "%" },
  { id: 2, cat: "Career & Studies", titulo: "Study for ENEM", atual: 0, meta: 100, unidade: "%" },
  { id: 3, cat: "Career & Studies", titulo: "Enter Elec. Engineering (IFSP)", atual: 0, meta: 100, unidade: "%" },
  { id: 4, cat: "Career & Studies", titulo: "Get Hired at ISA Energia", atual: 0, meta: 100, unidade: "%" },
  { id: 5, cat: "Career & Studies", titulo: "Get Electrotechnical License", atual: 0, meta: 100, unidade: "%" },
  { id: 6, cat: "Career & Studies", titulo: "Master Math/Phys/Elec", atual: 0, meta: 100, unidade: "%" },
  { id: 7, cat: "Career & Studies", titulo: "Polyglot (Speak 4 Languages)", atual: 0, meta: 4, unidade: "langs" },
  { id: 8, cat: "Career & Studies", titulo: "English C2 (Fluency)", atual: 0, meta: 100, unidade: "%" },
  { id: 9, cat: "Health & Body", titulo: "Stabilize BP/Glucose", atual: 0, meta: 100, unidade: "%" },
  { id: 10, cat: "Health & Body", titulo: "Reach Ideal Weight (80kg)", atual: 100, meta: 80, unidade: "kg", start: 100 },
  { id: 11, cat: "Health & Body", titulo: "Learn to Swim", atual: 0, meta: 100, unidade: "%" },
  { id: 12, cat: "Skills & Leisure", titulo: "Learn Cavaquinho", atual: 0, meta: 100, unidade: "%" },
  { id: 13, cat: "Skills & Leisure", titulo: "Annual Reading Goal", atual: 0, meta: 12, unidade: "books" },
  { id: 14, cat: "Skills & Leisure", titulo: "Travel Abroad", atual: 0, meta: 100, unidade: "%" },
  { id: 15, cat: "Finance & Assets", titulo: "Clear Debt/Name", atual: 0, meta: 100, unidade: "%" },
  { id: 16, cat: "Finance & Assets", titulo: "Salary 10k/month", atual: 0, meta: 10000, unidade: "BRL" },
  { id: 17, cat: "Finance & Assets", titulo: "1 Million Net Worth", atual: 0, meta: 1000000, unidade: "BRL" },
  { id: 18, cat: "Finance & Assets", titulo: "Buy Own House", atual: 0, meta: 100, unidade: "%" },
  { id: 19, cat: "Finance & Assets", titulo: "Buy Motorcycle", atual: 0, meta: 10000, unidade: "BRL" },
  { id: 20, cat: "Finance & Assets", titulo: "Buy Automatic Car", atual: 0, meta: 50000, unidade: "BRL" },
  { id: 21, cat: "Finance & Assets", titulo: "Get Married", atual: 0, meta: 100, unidade: "%" },
  // NEW MISSIONS
  { id: 22, cat: "Health & Body", titulo: "30 Days Zero Sugar", atual: 0, meta: 30, unidade: "days" },
  { id: 24, cat: "Health & Body", titulo: "Gym 5x/week (3 months)", atual: 0, meta: 60, unidade: "workouts" },
  { id: 26, cat: "Health & Body", titulo: "Lower HbA1c to 5%", atual: 9, meta: 5, unidade: "%", start: 9 },
];

const inputIds = ["pressao_sis", "pressao_dia", "glicemia", "acucar", "agua", "sono", "treino", "cardio", "estudo", "exercicios", "leitura", "idioma"];

// ====== DATE FUNCTION ======
function getDataHoje() {
    const d = new Date();
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// ====== INITIALIZATION ======
let progresso = JSON.parse(localStorage.getItem("lifeRPG")) || {
  xpTotal: 0,
  nivel: 1,
  historico: [],
  missoes: JSON.parse(JSON.stringify(listaMissoesPadrao))
};

// === SMART SYNC (Translate Titles) ===
if (progresso.missoes) {
    listaMissoesPadrao.forEach(padrao => {
        const existe = progresso.missoes.find(m => m.id === padrao.id);
        if (!existe) {
            progresso.missoes.push(JSON.parse(JSON.stringify(padrao)));
        } else {
            // TRANSLATE TITLES: Overwrite stored title with the new English one
            existe.titulo = padrao.titulo;
            existe.cat = padrao.cat; // Translate Category
            existe.meta = padrao.meta;
            existe.unidade = padrao.unidade;
            if (padrao.start !== undefined) existe.start = padrao.start;
        }
    });
    localStorage.setItem("lifeRPG", JSON.stringify(progresso));
} else {
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

// ====== DATE LOGIC ======
function stringParaData(dataStr) {
    if(!dataStr) return new Date();
    const partes = dataStr.split('/');
    return new Date(partes[2], partes[1] - 1, partes[0]);
}

function verificarDiasPerdidos() {
    if (!progresso.historico || progresso.historico.length === 0) return;
    
    const hojeStr = getDataHoje();
    const ultimoRegistroStr = progresso.historico[0].data;
    
    if (hojeStr === ultimoRegistroStr) return;

    const dataHoje = stringParaData(hojeStr);
    const dataUltimo = stringParaData(ultimoRegistroStr);
    
    const diffTempo = dataHoje.getTime() - dataUltimo.getTime();
    const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24)); 

    let diasPenalizados = 0;

    for (let i = 1; i < diffDias; i++) {
        let diaPerdido = new Date(dataHoje);
        diaPerdido.setDate(dataHoje.getDate() - i); 
        
        const d = String(diaPerdido.getDate()).padStart(2, '0');
        const m = String(diaPerdido.getMonth() + 1).padStart(2, '0');
        const a = diaPerdido.getFullYear();
        let dataPerdidaStr = `${d}/${m}/${a}`;

        if (!progresso.historico.find(d => d.data === dataPerdidaStr)) {
            let xpPerdido = -50; 
            let status = "FORGOT 💀"; // Translated
            progresso.historico.unshift({
                data: dataPerdidaStr,
                xp: xpPerdido,
                status: status,
                detalhes: {
                    pressao_sis: "N/A", pressao_dia: "N/A", glicemia: "N/A", 
                    acucar: "N/A", agua: "N/A", sono: "N/A", treino: "N/A", 
                    cardio: "N/A", estudo: "N/A", exercicios: "N/A", leitura: "N/A", idioma: "N/A"
                }
            });
            progresso.xpTotal += xpPerdido;
            diasPenalizados++;
        }
    }

    progresso.historico.sort((a, b) => stringParaData(b.data) - stringParaData(a.data));
    if (diasPenalizados > 0) {
        salvar();
        alert(`⚠️ WARNING!\n\nYou forgot the diary for ${diasPenalizados} day(s).\nPenalty: ${diasPenalizados * 50} XP deducted.`);
    }
}

setInterval(() => {
    verificarDiasPerdidos();
    carregarDadosHoje();
}, 60000);

// ====== INTERFACE ======
function calcularNivel() {
    progresso.nivel = Math.floor(progresso.xpTotal / 1000) + 1;
}

function carregarDadosHoje() {
    const hoje = getDataHoje();
    const registroHoje = progresso.historico.find(dia => dia.data === hoje);

    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = ""; 
    });

    if (registroHoje && registroHoje.detalhes) {
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && registroHoje.detalhes[id] !== "N/A") {
                el.value = registroHoje.detalhes[id];
            }
        });
    }
}

function atualizarInterface() {
    calcularNivel();

    const xpBanner = document.getElementById("banner-xp");
    const nivelDisplay = document.getElementById("nivel-display");
    if(xpBanner) xpBanner.innerText = `XP: ${progresso.xpTotal}`;
    if(nivelDisplay) nivelDisplay.innerText = `LEVEL ${progresso.nivel}`; // Translated

    const listaHistorico = document.getElementById("lista-historico");
    if(listaHistorico) {
        let html = "";
        if(!progresso.historico) progresso.historico = [];

        progresso.historico.forEach((dia, index) => {
            let cor = dia.xp >= 0 ? "#4ade80" : "#f87171";
            let det = dia.detalhes || {};

            let textoAcucar = det.acucar === "nao" ? "🚫 Zero" : (det.acucar === "sim" ? "🍬 Ate" : "-");
            let textoAgua = det.agua === "sim" ? "💧 2L+" : (det.agua === "nao" ? "❌ <2L" : "-");
            let textoPressao = (det.pressao_sis && det.pressao_dia) ? `${det.pressao_sis}/${det.pressao_dia}` : (det.pressao_sis || '-');

            html += `
            <div class="historico-item">
                <div class="historico-cabecalho">
                    <span style="color: #fff; font-weight:bold;">${dia.data}</span>
                    <span style="color: ${cor}; font-weight: bold;">${dia.xp} XP</span>
                    <button onclick="deletarItem(${index})" class="btn-lixeira">🗑️</button>
                </div>
                
                <div class="historico-detalhes">
                    <span>🩺 BP: <b style="color:#fff">${textoPressao}</b></span>
                    <span>🩸 Glucose: <b style="color:#fff">${det.glicemia || '-'}</b></span>
                    <span>🚫 Sugar: <b style="color:#fff">${textoAcucar}</b></span>
                    <span>💧 Water: <b style="color:#fff">${textoAgua}</b></span>
                    <span>😴 Sleep: <b style="color:#fff">${det.sono || '-'}h</b></span>
                    <span>🏋️ Gym: <b style="color:#fff">${det.treino || '-'}</b></span>
                    <span>🏃 Cardio: <b style="color:#fff">${det.cardio || '-'}min</b></span>
                    <span>🧠 Study: <b style="color:#fff">${det.estudo || '-'}min</b></span>
                    <span>📐 Math: <b style="color:#fff">${det.exercicios || '-'}</b></span>
                    <span>📚 Read: <b style="color:#fff">${det.leitura || '-'}min</b></span>
                    <span>🗣️ Lang: <b style="color:#fff">${det.idioma || '-'}min</b></span>
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

        let porcentagem = 0;
        
        if (missao.start !== undefined) {
            let totalParaPercorrer = Math.abs(missao.start - missao.meta);
            let jaPercorrido = Math.abs(missao.start - missao.atual);
            if (totalParaPercorrer === 0) porcentagem = 100;
            else porcentagem = (jaPercorrido / totalParaPercorrer) * 100;

            if (missao.start > missao.meta && missao.atual > missao.start) porcentagem = 0;
            
        } else {
            porcentagem = (missao.atual / missao.meta) * 100;
        }

        if (porcentagem > 100) porcentagem = 100;
        if (porcentagem < 0) porcentagem = 0;

        let valorMostrado = missao.atual;
        if (!Number.isInteger(valorMostrado)) valorMostrado = valorMostrado.toFixed(1);

        html += `
        <div class="missao-card">
            <div class="missao-header">
                <span>${missao.titulo}</span>
                <span>${valorMostrado} / ${missao.meta} ${missao.unidade || ''}</span>
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

// === CHANGE PROGRESS (Smart Steps) ===
function alterarProgresso(index, direction) {
    let missao = progresso.missoes[index];
    
    let estavaCompleta = false;
    if (missao.start !== undefined && missao.start > missao.meta) {
        estavaCompleta = missao.atual <= missao.meta;
    } else {
        estavaCompleta = missao.atual >= missao.meta;
    }

    let passo = missao.step !== undefined ? missao.step : 5;
    
    if (missao.meta >= 1000 && missao.step === undefined) passo = 100; 
    if (missao.meta >= 100000 && missao.step === undefined) passo = 5000;

    missao.atual += (direction * passo);
    missao.atual = Math.round(missao.atual * 100) / 100;

    if (missao.atual < 0) missao.atual = 0;

    let completouAgora = false;
    
    if (missao.start !== undefined && missao.start > missao.meta) {
        completouAgora = missao.atual <= missao.meta;
    } else {
        completouAgora = missao.atual >= missao.meta;
        if (missao.atual > missao.meta) missao.atual = missao.meta; 
    }

    if (!estavaCompleta && completouAgora) {
        const bonus = 1000;
        progresso.xpTotal += bonus;
        // Translated Alert
        alert(`🎉 CONGRATS! Quest "${missao.titulo}" Completed!\n\nYou gained +${bonus} XP and Leveled Up! 🚀`);
    }

    if (estavaCompleta && !completouAgora) {
        const penalty = 1000;
        progresso.xpTotal -= penalty;
        if(progresso.xpTotal < 0) progresso.xpTotal = 0; 
    }

    salvar();
}

// === CALCULATE XP ===
function calcularXP() {
    const msgErro = document.getElementById("msg-erro");
    msgErro.innerHTML = "";
    const hoje = getDataHoje();

    const indexHoje = progresso.historico.findIndex(dia => dia.data === hoje);
    let xpAnterior = 0;
    if (indexHoje !== -1) xpAnterior = progresso.historico[indexHoje].xp;

    const vPressaoSis = document.getElementById("pressao_sis").value;
    const vPressaoDia = document.getElementById("pressao_dia").value;
    const vGlicemia = document.getElementById("glicemia").value;
    const vAcucar = document.getElementById("acucar").value;
    const vAgua = document.getElementById("agua").value; 
    const vSono = document.getElementById("sono").value;
    const vTreino = document.getElementById("treino").value;
    const vCardio = document.getElementById("cardio").value;
    const vEstudo = document.getElementById("estudo").value;
    const vExercicios = document.getElementById("exercicios").value;
    const vLeitura = document.getElementById("leitura").value;
    const vIdioma = document.getElementById("idioma").value;

    let xp = 0;

    // BP
    let sistolica = Number(vPressaoSis);
    if (sistolica > 50) sistolica = Math.floor(sistolica / 10);

    if (vPressaoSis !== "" && sistolica === 11) xp += 5; 
    else if (vPressaoSis !== "" && sistolica === 12) xp += 3; 
    else if (vPressaoSis !== "" && sistolica === 13) xp += 2; 
    else if (vPressaoSis !== "" && sistolica >= 14) xp -= 5;
    else xp -= 5; 

    // Glucose
    const glicemia = Number(vGlicemia);
    if (vGlicemia !== "" && glicemia < 99) xp += 5; 
    else if (vGlicemia !== "" && glicemia <= 110) xp += 3; 
    else xp -= 5;

    // Sugar
    if (vAcucar === "nao") xp += 5; 
    else xp -= 5;

    // Water
    if (vAgua === "sim") xp += 5;
    else xp -= 5;

    // Sleep
    const sono = Number(vSono);
    if (vSono !== "" && sono >= 7) xp += 5; 
    else if (vSono !== "" && sono >= 5) xp += 3; 
    else xp -= 5;

    // Workout
    xp += vTreino === "sim" ? 5 : -5;

    // Cardio
    const cardio = Number(vCardio);
    if (vCardio !== "" && cardio >= 60) xp += 5; 
    else if (vCardio !== "" && cardio >= 30) xp += 3; 
    else xp -= 5;

    // Mind
    const estudo = Number(vEstudo);
    if (vEstudo !== "" && estudo >= 60) xp += 5; 
    else if (vEstudo !== "" && estudo >= 30) xp += 3; 
    else xp -= 5; 

    const exercicios = Number(vExercicios);
    if (vExercicios !== "" && exercicios >= 10) xp += 5; 
    else if (vExercicios !== "" && exercicios >= 5) xp += 3; 
    else xp -= 5; 

    const leitura = Number(vLeitura);
    if (vLeitura !== "" && leitura >= 30) xp += 5; 
    else if (vLeitura !== "" && leitura >= 15) xp += 3; 
    else xp -= 5; 

    const idioma = Number(vIdioma);
    if (vIdioma !== "" && idioma >= 60) xp += 5; 
    else if (vIdioma !== "" && idioma >= 30) xp += 3; 
    else xp -= 5; 

    // Status
    let status = "NORMAL";
    if (xp >= 50) status = "LEGENDARY 👑";
    else if (xp >= 40) status = "ELITE 🔥"; 
    else if (xp >= 30) status = "GOOD 🚀"; 
    else if (xp < 10) status = "CRITICAL 💀";

    progresso.xpTotal = progresso.xpTotal - xpAnterior + xp;

    const dadosDia = {
        data: hoje,
        xp: xp,
        status: status,
        detalhes: {
            pressao_sis: vPressaoSis,
            pressao_dia: vPressaoDia,
            glicemia: vGlicemia,
            acucar: vAcucar,
            agua: vAgua,
            sono: vSono,
            treino: vTreino,
            cardio: vCardio,
            estudo: vEstudo,
            exercicios: vExercicios,
            leitura: vLeitura,
            idioma: vIdioma
        }
    };

    if (indexHoje !== -1) {
        progresso.historico[indexHoje] = dadosDia;
    } else {
        progresso.historico.unshift(dadosDia);
        if (progresso.historico.length > 30) progresso.historico.pop();
    }

    const divResultado = document.getElementById("resultado");
    divResultado.style.display = "block";
    divResultado.innerHTML = `<h2>UPDATED</h2><span>${xp} XP</span><br>${status}`;

    salvar();
}

// === TOOL: ADJUST XP ===
function ajustarXPManual() {
    const valorAtual = progresso.xpTotal;
    // Translated Prompt
    const novoValor = prompt(`Current XP: ${valorAtual}\n\nEnter corrected XP (e.g., 500):`);
    
    if (novoValor !== null && novoValor.trim() !== "") {
        const xpNumerico = parseInt(novoValor);
        if (!isNaN(xpNumerico)) {
            progresso.xpTotal = xpNumerico;
            salvar();
            alert(`✅ XP Set to ${xpNumerico}!`);
        } else {
            alert("❌ Invalid number.");
        }
    }
}

function deletarItem(index) {
    if(confirm("Delete record?")) {
        progresso.xpTotal -= progresso.historico[index].xp;
        progresso.historico.splice(index, 1);
        salvar();
    }
}

function resetarDados() {
    if(confirm("⚠️ WIPE ALL DATA?")) {
        localStorage.removeItem("lifeRPG");
        location.reload();
    }
}

function exportarDados() {
    const dados = JSON.stringify(progresso);
    navigator.clipboard.writeText(dados).then(() => {
        alert("✅ DATA COPIED!");
    }).catch(err => prompt("Copy this:", dados));
}

function importarDados() {
    const dados = prompt("Paste here:");
    if (dados) {
        try {
            const json = JSON.parse(dados);
            if (json.xpTotal !== undefined) {
                progresso = json;
                salvar();
                alert("✅ Loaded!");
            }
        } catch (e) { alert("❌ Error."); }
    }
}

// Start
verificarDiasPerdidos();
carregarDadosHoje();
atualizarInterface();
