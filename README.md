# 🎮 Life RPG - Gamificando a Vida

> "Dias fortes criam heróis. Dias fracos criam consequências."

O **Life RPG** é uma aplicação web progressiva (PWA) desenvolvida para transformar a rotina diária, metas e desenvolvimento pessoal em um jogo de RPG. O sistema utiliza pontuação (XP), níveis e barras de progresso para monitorar saúde, estudos, carreira e objetivos financeiros.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Plataforma](https://img.shields.io/badge/Plataforma-Web%20%7C%20Mobile-blue)

## 📋 Funcionalidades

* **Check-in Diário:** Calculadora de XP baseada em métricas reais:
    * 🩺 **Saúde:** Pressão arterial, glicemia e horas de sono.
    * 🏋️ **Corpo:** Treino de academia e cardio.
    * 🧠 **Mente:** Tempo de estudo, exercícios de exatas, leitura e idiomas.
* **Sistema de Níveis:** Ganhe XP diariamente e suba de nível (Nível 1, 2, 3...).
* **Quest Log (Missões):** Acompanhamento de metas de longo prazo com barras de progresso percentual:
    * *Exemplos:* Pós-graduação, Inglês C2, Compra de bens, Metas financeiras.
* **Sincronização em Nuvem:** Integração com **Google Firebase Realtime Database**. Os dados são sincronizados instantaneamente entre PC e Celular.
* **Design Responsivo:** Interface otimizada para uso em smartphones (Mobile First).

## 🚀 Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules).
* **Backend / Database:** Google Firebase (Realtime Database).
* **Estilização:** CSS puro com Fontes Google (Roboto & Bangers).
* **Hospedagem:** GitHub Pages.

## ⚙️ Como Rodar Localmente

Como o projeto utiliza Módulos ES6 e Firebase, ele precisa ser rodado em um servidor local (não basta abrir o arquivo html).

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/1brunosantos/Life-RPG.git](https://github.com/1brunosantos/Life-RPG.git)
    ```
2.  **Entre na pasta:**
    ```bash
    cd Life-RPG
    ```
3.  **Inicie um servidor local:**
    * Se usar VS Code: Instale a extensão "Live Server" e clique em "Go Live".
    * Ou via Python: `python -m http.server`
    * Ou via Node: `npx serve`

## 🕹️ Regras do Jogo

O cálculo de XP segue uma lógica rigorosa para incentivar bons hábitos:

| Categoria | Meta Ideal (+XP) | Meta Aceitável (+XP) | Crítico (-XP) |
| :--- | :--- | :--- | :--- |
| **Pressão** | 11/x (+50) | 12/x (+30) | ≥14/x (-30) |
| **Glicemia** | <99 (+50) | 99-149 (+30) | >150 (-30) |
| **Sono** | 5h-7h (+50) | >7h (+100) | <5h (-30) |
| **Estudo** | 30-60min (+50) | >60min (+100) | <30min (-30) |

---

### 🌐 Acesso ao Jogo

Jogue agora diretamente pelo navegador (PC ou Celular):

🔗 **[https://1brunosantos.github.io/Life-RPG/](https://1brunosantos.github.io/Life-RPG/)**
