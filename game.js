// ====== LISTA INICIAL (Só usada no primeiro carregamento) ======
const listaMissoesPadrao = [
  { id: 1, cat: "Carreira & Estudos", titulo: "Pós-Graduação Concluída", atual: 0, meta: 100, unidade: "%" },
  { id: 2, cat: "Carreira & Estudos", titulo: "Nota Alta no Enem", atual: 0, meta: 900, unidade: "pts" },
  { id: 3, cat: "Carreira & Estudos", titulo: "Eng. Elétrica IFSP", atual: 0, meta: 100, unidade: "%" },
  { id: 4, cat: "Carreira & Estudos", titulo: "Efetivação ISA Energia", atual: 0, meta: 100, unidade: "%" },
  { id: 5, cat: "Carreira & Estudos", titulo: "Registro Eletrotécnico", atual: 0, meta: 100, unidade: "%" },
  { id: 6, cat: "Carreira & Estudos", titulo: "Dominar Mat/Fís/Elé", atual: 0, meta: 100, unidade: "%" },
  { id: 7, cat: "Carreira & Estudos", titulo: "Poliglota (4 Idiomas)", atual: 0, meta: 4, unidade: "idiomas" },
  { id: 8, cat: "Carreira & Estudos", titulo: "Inglês C2 (Fluência)", atual: 0, meta: 100, unidade: "%" },
  { id: 9, cat: "Saúde & Físico", titulo: "Pressão/Glicemia OK", atual: 0, meta: 100, unidade: "%" },
  { id: 10, cat: "Saúde & Físico", titulo: "Peso Ideal (1.75m/38a)", atual: 0, meta: 100, unidade: "%" },
  { id: 11, cat: "Saúde & Físico", titulo: "Aprender a Nadar", atual: 0, meta: 100, unidade: "%" },
  { id: 12, cat: "Habilidades & Lazer", titulo: "Aprender Cavaquinho", atual: 0, meta: 100, unidade: "%" },
  { id: 13, cat: "Habilidades & Lazer", titulo: "Ler 1 Livro por Mês", atual: 0, meta: 12, unidade: "livros" },
  { id: 14, cat: "Habilidades & Lazer", titulo: "Viajar para Outro País", atual: 0, meta: 100, unidade: "%" },
  { id: 15, cat: "Financeiro & Bens", titulo: "Limpar o Nome", atual: 0, meta: 100, unidade: "%" },
  { id: 16, cat: "Financeiro & Bens", titulo: "Salário de 10k/mês", atual: 0, meta: 10000, unidade: "R$" },
  { id: 17, cat: "Financeiro & Bens", titulo: "Juntar 1 Milhão", atual: 0, meta: 1000000, unidade: "R$" },
  { id: 18, cat: "Financeiro & Bens", titulo: "Comprar Casa Própria", atual: 0, meta: 100, unidade: "%" },
  { id: 19, cat: "Financeiro & Bens", titulo: "Comprar Moto", atual: 0, meta: 100, unidade: "%" },
  { id: 20, cat: "Financeiro & Bens", titulo: "Comprar Carro Automático", atual: 0, meta: 100, unidade: "%" },
  { id: 21, cat: "Financeiro & Bens", titulo: "Casar", atual: 0, meta: 100, unidade: "%" },
];

const inputIds = ["pressao", "glicemia", "sono", "treino", "cardio", "estudo", "exercicios", "leitura", "idioma"];

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

    // === HISTÓRICO DETALHADO ===
    const listaHistorico = document.getElementById("lista-historico");
    if(listaHistorico) {
        let html = "";
        if(!progresso.historico) progresso.historico = [];
        
        progresso.historico.forEach((dia, index) => {
            let cor = dia.xp >= 0 ? "#4ade80" : "#f87171";
            
            // Verifica se existem detalhes (para compatibilidade com dados antigos)
            let det = dia.detalhes || {}; 

            html += `
            <div class="historico-item">
                <div class="historico-cabecalho">
                    <span style="color: #fff; font-weight:bold;">${dia.data}</span>
                    <span style="color: ${cor}; font-weight: bold;">${dia.xp} XP</span>
                    <button onclick="deletarItem(${index})" class="btn-lixeira">🗑️</button>
                </div>
                <div style="text-align:center; margin-bottom:5px; font-size:12px; color:#fbbf24;">${dia.status}</div>
                
                <div class="historico-detalhes">
                    <span>🩺 Pressão: ${det.pressao || '-'}</span>
                    <span>🩺 Glicemia: ${det.glicemia || '-'}</span>
                    <span>😴 Sono: ${det.sono || '-'}h</span>
                    <span>🏋️ Treino: ${det.treino || '-'}</span>
                    <span>🏃 Cardio: ${det.cardio || '-'}min</span>
                    <span>🧠 Estudo: ${det.estudo || '-'}min</span>
                    <span>📐 Exer.: ${det.exercicios || '-'}</span>
                    <span>📚 Leitura: ${det.leitura || '-'}min</span>
                    <span>🗣️ Idioma: ${det.idioma || '-'}min</span>
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

// ====== AÇÕES & LÓGICA ======

function alterarProgresso(index, valor) {
    let missao = progresso.missoes[index];
    
    // REGRA DE 5%: Calcula 5% da meta total
    let passo = Math.ceil(missao.meta * 0.05);
    
    // Se a meta for muito pequena (ex: 1 check), o passo é 1
    if (passo < 1) passo = 1;

    // Aplica o incremento ou decremento
    missao.atual += (valor * passo);

    // Limites
    if (missao.atual < 0) missao.atual = 0;
    if (missao.atual > missao.meta) missao.atual = missao.meta;
    
    salvar();
}

function adicionarMissao() {
    const cat = document.getElementById("nova-cat").value;
    const tit = document.getElementById("nova-titulo").value;
    const met = Number(document.getElementById("nova-meta").value);
    const uni = document.getElementById("nova-unidade").value;

    if(!cat || !tit || !met || !uni) {
        alert("Preencha todos os campos da nova missão!");
        return;
    }

    progresso.missoes.push({
        id: Date.now(), // ID único baseado no tempo
        cat: cat,
        titulo: tit,
        atual: 0,
        meta: met,
        unidade: uni
    });

    // Limpa campos
    document.getElementById("nova-cat").value = "";
    document.getElementById("nova-titulo").value = "";
    document.getElementById("nova-meta").value = "";
    document.getElementById("nova-unidade").value = "";

    alert("Missão criada com sucesso!");
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

    // Captura os valores ANTES do cálculo para salvar no histórico
    const valPressao = document.getElementById("pressao").value;
    const valGlicemia = document.getElementById("glicemia").value;
    const valSono = document.getElementById("sono").value;
    const valTreino = document.getElementById("treino").value;
    const valCardio = document.getElementById("cardio").value;
    const valEstudo = document.getElementById("estudo").value;
    const valExercicios = document.getElementById("exercicios").value;
    const valLeitura = document.getElementById("leitura").value;
    const valIdioma = document.getElementById("idioma").value;

    // Validação
    for (let id of inputIds) {
        if (!document.getElementById(id).value) {
            msgErro.innerHTML = "⚠️ Preencha todos os campos!";
            return;
        }
    }

    let xp = 0;
    
    // Lógica XP
    const pressao = Number(valPressao);
    if (pressao === 11) xp += 50; else if (pressao === 12) xp += 30; else if (pressao === 13) xp += 10; else if (pressao >= 14) xp -= 30;
    
    const glicemia = Number(valGlicemia);
    if (glicemia < 99) xp += 50; else if (glicemia <= 149) xp += 30; else if (glicemia === 150) xp += 10; else if (glicemia > 150) xp -= 30;
    
    xp += valTreino === "sim" ? 50 : -30;
    
    const cardio = Number(valCardio);
    if (cardio >= 30 && cardio <= 59) xp += 50; else if (cardio >= 60) xp += 100; else xp -= 30;
    
    const sono = Number(valSono);
    if (sono >= 5 && sono <= 7) xp += 50; else if (sono > 7) xp += 100; else xp -= 30;
    
    const estudo = Number(valEstudo);
    if (estudo >= 30 && estudo <= 60) xp += 50; else if (estudo > 60) xp += 100; else xp -= 30;
    
    const exercicios = Number(valExercicios);
    if (exercicios >= 5 && exercicios <= 10) xp += 50; else if (exercicios > 10) xp += 100; else xp -= 30;
    
    const leitura = Number(valLeitura);
    if (leitura >= 15 && leitura <= 30) xp += 50; else if (leitura > 30) xp += 100; else xp -= 30;
    
    const idioma = Number(valIdioma);
    if (idioma >= 30 && idioma <= 60) xp += 50; else if (idioma > 60) xp += 100; else xp -= 30;

    let status = "NORMAL";
    if (xp >= 400) status = "ELITE 🔥";
    else if (xp >= 250) status = "EVOLUINDO 🚀";
    else if (xp < 100) status = "CRÍTICO 💀";

    progresso.xpTotal += xp;
    
    // Adiciona ao histórico COM DETALHES
    progresso.historico.unshift({
        data: hoje,
        xp: xp,
        status: status,
        detalhes: {
            pressao: valPressao,
            glicemia: valGlicemia,
            sono: valSono,
            treino: valTreino,
            cardio: valCardio,
            estudo: valEstudo,
            exercicios: valExercicios,
            leitura: valLeitura,
            idioma: valIdioma
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
    if(confirm("⚠️ ATENÇÃO: Isso apagará TUDO deste celular. Tem certeza?")) {
        localStorage.removeItem("lifeRPG");
        location.reload();
    }
}

function exportarDados() {
    const dados = JSON.stringify(progresso);
    navigator.clipboard.writeText(dados).then(() => {
        alert("✅ DADOS COPIADOS!");
    }).catch(err => {
        prompt("Copie manualmente:", dados);
    });
}

function importarDados() {
    const dados = prompt("Cole aqui o código:");
    if (dados) {
        try {
            const json = JSON.parse(dados);
            if (json.xpTotal !== undefined) {
                progresso = json;
                salvar();
                alert("✅ Dados carregados!");
            }
        } catch (e) {
            alert("❌ Erro ao ler dados.");
        }
    }
}

atualizarInterface();
