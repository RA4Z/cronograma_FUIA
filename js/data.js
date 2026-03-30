// ─── CONSTANTS & DATA ────────────────────────────────────────────────────────

const COLORS = [
    { id: 'gabriel', label: 'Azul',    cls: 'c-gabriel', badge: 'b-gabriel', hex: '#4f7dff' },
    { id: 'robert',  label: 'Roxo',    cls: 'c-robert',  badge: 'b-robert',  hex: '#c084fc' },
    { id: 'green',   label: 'Verde',   cls: 'c-green',   badge: 'b-green',   hex: '#34d399' },
    { id: 'orange',  label: 'Laranja', cls: 'c-orange',  badge: 'b-orange',  hex: '#fb923c' },
    { id: 'rose',    label: 'Rosa',    cls: 'c-rose',    badge: 'b-rose',    hex: '#fb7185' },
    { id: 'cyan',    label: 'Ciano',   cls: 'c-cyan',    badge: 'b-cyan',    hex: '#22d3ee' },
    { id: 'yellow',  label: 'Amarelo', cls: 'c-yellow',  badge: 'b-yellow',  hex: '#fbbf24' },
    { id: 'indigo',  label: 'Índigo',  cls: 'c-indigo',  badge: 'b-indigo',  hex: '#818cf8' },
];
const colorById = id => COLORS.find(c => c.id === id) || COLORS[0];

const STATUS_OPTS = [
    { id: 'pending',     label: 'Pendente',      cls: 's-pending' },
    { id: 'in-progress', label: 'Em Andamento',  cls: 's-in-progress' },
    { id: 'done',        label: 'Concluído',     cls: 's-done' },
    { id: 'blocked',     label: 'Bloqueado',     cls: 's-blocked' },
];
const statusById = id => STATUS_OPTS.find(s => s.id === id) || STATUS_OPTS[0];

const MEMBER_POOL = [
    { name: 'Gabriel Volles Marinho',  color: 'gabriel' },
    { name: 'Robert Aron Zimmermann',  color: 'robert' },
    { name: 'Ana Clara Souza',         color: 'green' },
    { name: 'Carlos Mendes',           color: 'orange' },
    { name: 'Beatriz Lopes',           color: 'rose' },
    { name: 'Felipe Torres',           color: 'cyan' },
];

const uid = () => Math.random().toString(36).slice(2, 10);

function defaultProjects() {
    return [
        {
            id: uid(),
            name: 'FUIA — Plataforma Principal',
            description: 'Sistema completo de gerenciamento com IA',
            color: 'gabriel',
            members: [
                { name: 'Gabriel Volles Marinho', color: 'gabriel' },
                { name: 'Robert Aron Zimmermann', color: 'robert' },
            ],
            tasks: [
                { id: uid(), atividade: 'Conexão com base de dados',       resp: 'Gabriel Volles Marinho', respColor: 'gabriel', inicio: '23/03/2026', fim: '27/03/2026', progress: 100, status: 'done' },
                { id: uid(), atividade: 'Segurança/autenticação',           resp: 'Gabriel Volles Marinho', respColor: 'gabriel', inicio: '27/03/2026', fim: '08/04/2026', progress: 65,  status: 'in-progress' },
                { id: uid(), atividade: 'Sistema resposta fornecedores',    resp: 'Gabriel Volles Marinho', respColor: 'gabriel', inicio: '08/04/2026', fim: '13/04/2026', progress: 20,  status: 'in-progress' },
                { id: uid(), atividade: 'Endpoint interface gerencial',     resp: 'Gabriel Volles Marinho', respColor: 'gabriel', inicio: '13/04/2026', fim: '01/05/2026', progress: 0,   status: 'pending' },
                { id: uid(), atividade: 'Interface fornecedores',           resp: 'Robert Aron Zimmermann', respColor: 'robert',  inicio: '13/04/2026', fim: '01/05/2026', progress: 0,   status: 'pending' },
                { id: uid(), atividade: 'Interface gerencial',              resp: 'Robert Aron Zimmermann', respColor: 'robert',  inicio: '01/05/2026', fim: '19/05/2026', progress: 0,   status: 'pending' },
                { id: uid(), atividade: 'Treinamento IA',                   resp: 'Todos',                  respColor: 'green',   inicio: '19/05/2026', fim: '20/06/2026', progress: 0,   status: 'pending' },
                { id: uid(), atividade: 'Lançamento FUIA',                  resp: 'Todos',                  respColor: 'green',   inicio: '20/06/2026', fim: '24/06/2026', progress: 0,   status: 'pending' },
            ],
        },
    ];
}
