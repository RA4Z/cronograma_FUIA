// ─── CONSTANTS & DATA ────────────────────────────────────────────────────────

const COLORS = [
    { id: 'gabriel', label: 'Azul', cls: 'c-gabriel', badge: 'b-gabriel', hex: '#4f7dff' },
    { id: 'robert', label: 'Roxo', cls: 'c-robert', badge: 'b-robert', hex: '#c084fc' },
    { id: 'green', label: 'Verde', cls: 'c-green', badge: 'b-green', hex: '#34d399' },
    { id: 'orange', label: 'Laranja', cls: 'c-orange', badge: 'b-orange', hex: '#fb923c' },
    { id: 'rose', label: 'Rosa', cls: 'c-rose', badge: 'b-rose', hex: '#fb7185' },
    { id: 'cyan', label: 'Ciano', cls: 'c-cyan', badge: 'b-cyan', hex: '#22d3ee' },
    { id: 'yellow', label: 'Amarelo', cls: 'c-yellow', badge: 'b-yellow', hex: '#fbbf24' },
    { id: 'indigo', label: 'Índigo', cls: 'c-indigo', badge: 'b-indigo', hex: '#818cf8' },
];
const colorById = id => COLORS.find(c => c.id === id) || COLORS[0];

const STATUS_OPTS = [
    { id: 'pending', label: 'Pendente', cls: 's-pending' },
    { id: 'in-progress', label: 'Em Andamento', cls: 's-in-progress' },
    { id: 'done', label: 'Concluído', cls: 's-done' },
    { id: 'blocked', label: 'Bloqueado', cls: 's-blocked' },
];
const statusById = id => STATUS_OPTS.find(s => s.id === id) || STATUS_OPTS[0];

const MEMBER_POOL = [
    { name: 'Gabriel Volles Marinho', color: 'gabriel' },
    { name: 'Rohan Dorneles Machado', color: 'robert' },
    { name: 'Robert Aron Zimmermann', color: 'green' },
    { name: 'Rogerio Henrique de Oliveira Schneider', color: 'orange' },
    { name: 'Francine Tromm', color: 'rose' },
    { name: 'Felipe Roiko Gugelmin', color: 'cyan' },
];

const uid = () => Math.random().toString(36).slice(2, 10);

function defaultProjects() {
    return [];
}
