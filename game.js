// ====== LISTA PADRÃO DE MISSÕES ======
const listaMissoesPadrao = [
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

const inputIds = ["pressao", "glicemia", "sono", "treino", "cardio", "estudo", "exercicios", "leitura", "idioma"];

// ====== INICIALIZAÇÃO (Carregar do LocalStorage) ======
let progresso = JSON.parse(localStorage.getItem("lifeRPG")) || {
  xpTotal: 0,
  nivel: 1,
  historico: [],
  missoes: JSON.parse(JSON.stringify(listaMissoesPadrao))
};

// Garantia: Se o usuário tem dados antigos mas sem missões, adiciona as missões agora
if (!progresso.missoes || progresso.missoes.length === 0) {
    progresso.missoes = JSON.parse(JSON.stringify(listaMissoesPadrao));
}

// Salva e Atualiza
function salvar() {
    localStorage.setItem("lifeRPG", JSON.stringify(progresso));
    atualizarInterface();
}

// ====== SISTEMA DE ABAS ======
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
    
    // Atualiza Topo
    const xpBanner = document.getElementById("banner-xp");
    const nivelDisplay = document.getElementById("nivel-display");
    if(xpBanner) xpBanner.innerText = `XP: ${progresso.xpTotal}`;
    if(nivelDisplay) nivelDisplay.innerText = `NÍVEL ${progresso.nivel}`;

    // Atualiza Histórico
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

    // Atualiza Missões
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

// ====== AÇÕES ======

function alterarProgresso(index, valor) {
    let missao = progresso.missoes[index];
    let incremento = 1;
    if (missao.meta >= 1000) incremento = 100; 
    else if (missao.meta >= 100) incremento = 5;

    missao.atual += (valor * incremento);
    if (missao.atual < 0) missao.atual = 0;
    if (missao.atual > missao.meta) missao.atual = missao.meta;
    salvar();
}

function calcularXP() {
    const msgErro = document.getElementById("msg-erro");
    msgErro.innerHTML = "";
    
    const hoje = new Date().toLocaleDateString("pt-BR");
    
    // Verifica se já jogou hoje
    if (progresso.historico.some(dia => dia.data === hoje)) {
        msgErro.innerHTML = "⚠️ Você já lançou o status de hoje!";
        return;
    }

    // Verifica campos vazios
    for (let id of inputIds) {
        const el = document.getElementById(id);
        if (!el || !el.value) {
            msgErro.innerHTML = "⚠️ Preencha todos os campos!";
            el.focus();
            return;
        }
    }

    let xp = 0;
    // Lógica de Pontos
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
    
    // Mantém apenas últimos 30 dias no histórico para economizar memória
    if (progresso.historico.length > 30) progresso.historico.pop();

    const divResultado = document.getElementById("resultado");
    divResultado.style.display = "block";
    divResultado.innerHTML = `<h2>RESULTADO</h2><span>${xp} XP</span><br>${status}`;
    
    salvar();
}

function deletarItem(index) {
    if(confirm("Deseja apagar este registro? O XP será descontado.")) {
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

// ====== BACKUP (EXPORTAR/IMPORTAR) ======
function exportarDados() {
    const dados = JSON.stringify(progresso);
    // Tenta copiar para a área de transferência
    navigator.clipboard.writeText(dados).then(() => {
        alert("✅ DADOS COPIADOS!\n\nEnvie o texto copiado para o seu novo celular (WhatsApp/Email) e use o botão 'Importar' lá.");
    }).catch(err => {
        // Fallback se não conseguir copiar
        prompt("Copie o código abaixo manualmente:", dados);
    });
}

function importarDados() {
    const dados = prompt("Cole aqui o código que você copiou do outro celular:");
    if (dados) {
        try {
            const json = JSON.parse(dados);
            if (json.xpTotal !== undefined) {
                progresso = json;
                salvar();
                alert("✅ Sucesso! Seus dados foram carregados.");
            } else {
                alert("❌ Código inválido.");
            }
        } catch (e) {
            alert("❌ Erro ao ler os dados. Verifique se copiou tudo.");
        }
    }
}

// Inicializa
atualizarInterface();
