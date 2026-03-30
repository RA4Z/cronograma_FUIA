// =====================================================
// DATA.JS — Dados do Projeto
// =====================================================

const PROJECT_DATA = [
    {
        atividade: "Conexão com base de dados",
        resp: "Gabriel Volles Marinho",
        inicio: "23/03/2026",
        fim: "27/03/2026",
    },
    {
        atividade: "Segurança/autenticação",
        resp: "Gabriel Volles Marinho",
        inicio: "27/03/2026",
        fim: "08/04/2026",
    },
    {
        atividade: "Sistema resposta fornecedores",
        resp: "Gabriel Volles Marinho",
        inicio: "08/04/2026",
        fim: "13/04/2026",
    },
    {
        atividade: "Endpoint interface gerencial",
        resp: "Gabriel Volles Marinho",
        inicio: "13/04/2026",
        fim: "01/05/2026",
    },
    {
        atividade: "Interface fornecedores",
        resp: "Robert Aron Zimmermann",
        inicio: "13/04/2026",
        fim: "01/05/2026",
    },
    {
        atividade: "Interface gerencial",
        resp: "Robert Aron Zimmermann",
        inicio: "01/05/2026",
        fim: "19/05/2026",
    },
    {
        atividade: "Treinamento IA",
        resp: "Todos",
        inicio: "19/05/2026",
        fim: "20/06/2026",
    },
    {
        atividade: "Lançamento FUIA",
        resp: "Todos",
        inicio: "20/06/2026",
        fim: "24/06/2026",
    }
];

// Estado de progresso das tarefas (persistível via localStorage)
const DEFAULT_PROGRESS = [
    { progress: 100, status: "done" },
    { progress: 65,  status: "in-progress" },
    { progress: 0,   status: "pending" },
    { progress: 0,   status: "pending" },
    { progress: 0,   status: "pending" },
    { progress: 0,   status: "pending" },
    { progress: 0,   status: "pending" },
    { progress: 0,   status: "pending" },
];

function loadProgressState() {
    try {
        const saved = localStorage.getItem('fuia-progress');
        if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROGRESS.map(p => ({ ...p }));
}

function saveProgressState(state) {
    try {
        localStorage.setItem('fuia-progress', JSON.stringify(state));
    } catch {}
}

// Estado global
let progressState = loadProgressState();
