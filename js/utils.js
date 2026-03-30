// ─── UTILITIES ───────────────────────────────────────────────────────────────

function parseDate(s) {
    const [d, m, y] = s.split('/');
    return new Date(+y, +m - 1, +d);
}

function diffDays(a, b) {
    return Math.ceil(Math.abs(b - a) / (864e5));
}

function fmtShort(d) {
    return `${d.getDate()} ${['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()]}`;
}

function fmtDate(d) {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function addDays(d, n) {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
}

function calcHealthScore(tasks) {
    if (!tasks.length) return 0;
    const today = new Date();
    let score = 100;
    tasks.forEach(t => {
        const end = parseDate(t.fim);
        const daysLate = (today - end) / 864e5;
        if (t.status === 'blocked') score -= 15;
        if (t.status !== 'done' && daysLate > 0) score -= Math.min(daysLate * 2, 20);
    });
    const avgProg = tasks.reduce((a, t) => a + t.progress, 0) / tasks.length;
    score = score * 0.6 + avgProg * 0.4;
    return Math.max(0, Math.min(100, Math.round(score)));
}

// ─── LOCAL STORAGE ────────────────────────────────────────────────────────────

function loadState() {
    try {
        const s = localStorage.getItem('fuia-v2');
        if (s) return JSON.parse(s);
    } catch { }
    return null;
}

function saveState(s) {
    try {
        localStorage.setItem('fuia-v2', JSON.stringify(s));
    } catch (e) {
        console.error("Erro ao salvar no LocalStorage (possível bloqueio do navegador):", e);
    }
}

// ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────

function newActivity(action, detail, color = 'gabriel') {
    return { id: uid(), action, detail, color, time: new Date().toISOString() };
}

function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
}

// ─── GANTT CALC ───────────────────────────────────────────────────────────────

function buildGanttMeta(tasks) {
    if (!tasks.length) return null;
    const dates = tasks.flatMap(t => [parseDate(t.inicio), parseDate(t.fim)]);
    const minD = new Date(Math.min(...dates));
    const maxD = new Date(Math.max(...dates));
    minD.setDate(minD.getDate() - 3);
    maxD.setDate(maxD.getDate() + 8);
    const totalMs = maxD - minD;

    const uniqueMap = new Map();
    tasks.forEach(t => {
        [parseDate(t.inicio), parseDate(t.fim)].forEach(d => uniqueMap.set(d.getTime(), d));
    });
    const ticks = Array.from(uniqueMap.values()).sort((a, b) => a - b);

    return { minD, maxD, totalMs, ticks };
}
