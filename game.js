// ====== LISTA PADRONIZADA ======
const listaMissoesPadrao = [
  { id: 1, cat: "Carreira & Estudos", titulo: "Concluir Pós-Graduação", atual: 0, meta: 100, unidade: "%" },
  { id: 2, cat: "Carreira & Estudos", titulo: "Estudar para Enem", atual: 0, meta: 100, unidade: "%" },
  { id: 3, cat: "Carreira & Estudos", titulo: "Ingressar na Eng. Elétrica IFSP", atual: 0, meta: 100, unidade: "%" },
  { id: 4, cat: "Carreira & Estudos", titulo: "Ser efetivado ISA Energia", atual: 0, meta: 100, unidade: "%" },
  { id: 5, cat: "Carreira & Estudos", titulo: "Obter registro Eletrotécnico", atual: 0, meta: 100, unidade: "%" },
  { id: 6, cat: "Carreira & Estudos", titulo: "Dominar Mat/Fís/Elé", atual: 0, meta: 100, unidade: "%" },
  { id: 7, cat: "Carreira & Estudos", titulo: "Poliglota (Falar 4 Idiomas)", atual: 0, meta: 100, unidade: "%" },
  { id: 8, cat: "Carreira & Estudos", titulo: "Inglês C2 (Fluência)", atual: 0, meta: 100, unidade: "%" },
  { id: 9, cat: "Saúde & Físico", titulo: "Pressão/Glicemia Estabilizadas", atual: 0, meta: 100, unidade: "%" },
  { id: 10, cat: "Saúde & Físico", titulo: "Alcançar Peso Ideal (80kg)", atual: 0, meta: 100, unidade: "%" },
  { id: 11, cat: "Saúde & Físico", titulo: "Aprender a Nadar", atual: 0, meta: 100, unidade: "%" },
  { id: 12, cat: "Habilidades & Lazer", titulo: "Aprender Cavaquinho", atual: 0, meta: 100, unidade: "%" },
  { id: 13, cat: "Habilidades & Lazer", titulo: "Meta Leitura Anual", atual: 0, meta: 100, unidade: "%" },
  { id: 14, cat: "Habilidades & Lazer", titulo: "Viajar para Outro País", atual: 0, meta: 100, unidade: "%" },
  { id: 15, cat: "Financeiro & Bens", titulo: "Limpar o Nome", atual: 0, meta: 100, unidade: "%" },
  { id: 16, cat: "Financeiro & Bens", titulo: "Salário de 10k/mês", atual: 0, meta: 100, unidade: "%" },
  { id: 17, cat: "Financeiro & Bens", titulo: "Juntar 1 Milhão", atual: 0, meta: 100, unidade: "%" },
  { id: 18, cat: "Financeiro & Bens", titulo: "Comprar Casa Própria", atual: 0, meta: 100, unidade: "%" },
  { id: 19, cat: "Financeiro & Bens", titulo: "Comprar Moto", atual: 0, meta: 100, unidade: "%" },
  { id: 20, cat: "Financeiro & Bens", titulo: "Comprar Carro Automático", atual: 0, meta: 100, unidade: "%" },
];

const inputIds = ["pressao", "glicemia", "acucar", "sono", "treino", "cardio", "estudo", "exercicios", "leitura", "idioma"];

// ====== INICIALIZAÇÃO ======
let progresso = JSON.parse(localStorage.getItem("lifeRPG")) || {
  xpTotal: 0,
  nivel: 1,
  historico: [],
  missoes: JSON.parse(JSON.stringify(listaMissoesPadrao))
};

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

// ====== LÓGICA DE DATAS E PENALIDADES ======

// Converte string "DD/MM/AAAA" para objeto Date
function stringParaData(dataStr) {
    if(!dataStr) return new Date();
    const partes = dataStr.split('/');
    return new Date(partes[2], partes[1] - 1, partes[0]);
}

// Verifica se pulou algum dia e aplica a PENALIDADE AUTOMÁTICA
function verificarDiasPerdidos() {
    if (!progresso.historico || progresso.historico.length === 0) return;

    const hojeStr = new Date().toLocaleDateString("pt-BR");
    const ultimoRegistroStr = progresso.historico[0].data;

    // Se o último registro é de hoje, está tudo certo
    if (hojeStr === ultimoRegistroStr) return;

    const dataHoje = stringParaData(hojeStr);
    const dataUltimo = stringParaData(ultimoRegistroStr);

    // Calcula diferença de dias
    const diffTempo = dataHoje - dataUltimo;
    const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24)); 
    
    // Se a diferença for maior que 1, significa que existem dias não preenchidos no meio
    // Ex: Último dia 10, Hoje dia 12. Diff = 2. O dia 11 ficou vazio.
    // O loop preenche esses buracos com penalidade máxima.
    
    let diasPenalizados = 0;

    for (let i = 1; i < diffDias; i++) {
        let diaPerdido = new Date(dataHoje);
        diaPerdido.setDate(dataHoje.getDate() - i); // Volta no tempo
        
        let dataPerdidaStr = diaPerdido.toLocaleDateString("pt-BR");
        
        // Proteção contra duplicidade
        if (!progresso.historico.find(d => d.data === dataPerdidaStr)) {
            // APLICA PENALIDADE MÁXIMA (-50 XP)
            // (10 itens vazios * -5 pontos cada)
            let xpPerdido = -50; 
            let status = "ESQUECEU 💀";
            
            progresso.historico.unshift({
                data: dataPerdidaStr,
                xp: xpPerdido,
                status: status,
                detalhes: {
                    pressao: "N/A",
                    glicemia: "N/A",
                    acucar: "N/A",
                    sono: "N/A",
                    treino: "N/A",
                    cardio: "N/A",
                    estudo: "N/A",
                    exercicios: "N/A",
                    leitura: "N/A",
                    idioma: "N/A"
                }
            });
            
            progresso.xpTotal += xpPerdido;
            diasPenalizados++;
        }
    }
    
    // Reordena o histórico por data para garantir
    progresso.historico.sort((a, b) => stringParaData(b.data) - stringParaData(a.data));
    
    if (diasPenalizados > 0) {
        salvar();
        alert(`⚠️ ATENÇÃO!\n\nVocê esqueceu de preencher o diário por ${diasPenalizados} dia(s).\nForam descontados ${diasPenalizados * 50} XP automaticamente.`);
    }
}

// Checa a data a cada minuto (caso esteja com o app aberto na virada da noite)
setInterval(() => {
    verificarDiasPerdidos();
    carregarDadosHoje(); // Atualiza a tela se virou o dia
}, 60000);


// ====== INTERFACE ======
function calcularNivel() {
    progresso.nivel = Math.floor(progresso.xpTotal / 1000) + 1;
}

function carregarDadosHoje() {
    const hoje = new Date().toLocaleDateString("pt-BR");
    const registroHoje = progresso.historico.find(dia => dia.data === hoje);

    // Limpa inputs primeiro
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = ""; 
    });

    // Se tiver dados, preenche
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
    if(nivelDisplay) nivelDisplay.innerText = `NÍVEL ${progresso.nivel}`;

    // === HISTÓRICO ===
    const listaHistorico = document.getElementById("lista-historico");
    if(listaHistorico) {
        let html = "";
        if(!progresso.historico) progresso.historico = [];
        
        progresso.historico.forEach((dia, index) => {
            let cor = dia.xp >= 0 ? "#4ade80" : "#f87171";
            let det = dia.detalhes || {};
            let textoAcucar = det.acucar === "nao" ? "🚫 Zero" : (det.acucar === "sim" ? "🍬 Comeu" : "-");

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
                    <span>🚫 Açúcar: <b style="color:#fff">${textoAcucar}</b></span>
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

function alterarProgresso(index, valor) {
    let missao = progresso.missoes[index];
    missao.atual += (valor * 5);
    if (missao.atual < 0) missao.atual = 0;
    if (missao.atual > 100) missao.atual = 100;
    salvar();
}

function calcularXP() {
    const msgErro = document.getElementById("msg-erro");
    msgErro.innerHTML = "";
    const hoje = new Date().toLocaleDateString("pt-BR");
    
    const indexHoje = progresso.historico.findIndex(dia => dia.data === hoje);
    let xpAnterior = 0;

    if (indexHoje !== -1) {
        xpAnterior = progresso.historico[indexHoje].xp;
    }

    // CAPTURA
    const vPressao = document.getElementById("pressao").value;
    const vGlicemia = document.getElementById("glicemia").value;
    const vAcucar = document.getElementById("acucar").value;
    const vSono = document.getElementById("sono").value;
    const vTreino = document.getElementById("treino").value;
    const vCardio = document.getElementById("cardio").value;
    const vEstudo = document.getElementById("estudo").value;
    const vExercicios = document.getElementById("exercicios").value;
    const vLeitura = document.getElementById("leitura").value;
    const vIdioma = document.getElementById("idioma").value;

    let xp = 0;
    
    // === CÁLCULO ===
    // (Vazio "" conta como penalidade -5)

    // Pressão
    const pressao = Number(vPressao);
    if (vPressao !== "" && pressao === 11) xp += 5; 
    else if (vPressao !== "" && pressao === 12) xp += 3; 
    else if (vPressao !== "" && pressao === 13) xp += 2; 
    else if (vPressao !== "" && pressao >= 14) xp -= 5;
    else xp -= 5; // Vazio/Punição

    // Glicemia
    const glicemia = Number(vGlicemia);
    if (vGlicemia !== "" && glicemia < 99) xp += 5; 
    else if (vGlicemia !== "" && glicemia <= 110) xp += 3; 
    else xp -= 5;
    
    // Açúcar
    if (vAcucar === "nao") xp += 5; 
    else xp -= 5;
    
    // Sono
    const sono = Number(vSono);
    if (vSono !== "" && sono >= 7) xp += 5; 
    else if (vSono !== "" && sono >= 5) xp += 3; 
    else xp -= 5;

    // Treino
    xp += vTreino === "sim" ? 5 : -5;
    
    // Cardio
    const cardio = Number(vCardio);
    if (vCardio !== "" && cardio >= 60) xp += 5; 
    else if (vCardio !== "" && cardio >= 30) xp += 3; 
    else xp -= 5;
    
    // Mente
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
    if (xp >= 40) status = "ELITE 🔥"; 
    else if (xp >= 30) status = "BOM 🚀"; 
    else if (xp < 10) status = "CRÍTICO 💀";

    progresso.xpTotal = progresso.xpTotal - xpAnterior + xp;
    
    const dadosDia = {
        data: hoje,
        xp: xp,
        status: status,
        detalhes: {
            pressao: vPressao,
            glicemia: vGlicemia,
            acucar: vAcucar,
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
    divResultado.innerHTML = `<h2>ATUALIZADO</h2><span>${xp} XP</span><br>${status}`;
    
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

// Inicia verificação e carregamento
verificarDiasPerdidos();
carregarDadosHoje();
atualizarInterface();
