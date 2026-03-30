// =====================================================
// UTILS.JS — Funções Auxiliares
// =====================================================

function parseDate(dateStr) {
    const [dia, mes, ano] = dateStr.split('/');
    return new Date(+ano, +mes - 1, +dia);
}

function diffDays(date1, date2) {
    return Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
}

function formatShortDate(date) {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${date.getDate()} ${meses[date.getMonth()]}`;
}

function formatFullDate(date) {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
}

function getResponsavelClass(resp) {
    if (resp.includes('Robert')) return 'robert';
    if (resp.includes('Todos'))  return 'todos';
    return 'gabriel';
}

function getStatusLabel(status) {
    const map = {
        'pending':     'Pendente',
        'in-progress': 'Em Andamento',
        'done':        'Concluído',
        'blocked':     'Bloqueado',
    };
    return map[status] || status;
}

function getProgressColor(colorClass) {
    const map = {
        'gabriel': getComputedStyle(document.documentElement).getPropertyValue('--color-gabriel').trim() || '#3b6bfa',
        'robert':  getComputedStyle(document.documentElement).getPropertyValue('--color-robert').trim()  || '#9333ea',
        'todos':   getComputedStyle(document.documentElement).getPropertyValue('--color-todos').trim()   || '#059669',
    };
    return map[colorClass] || '#3b6bfa';
}

// Preprocessar os dados uma vez
function buildParsedData() {
    return PROJECT_DATA.map((item, index) => {
        const dataInicio = parseDate(item.inicio);
        const dataFim    = parseDate(item.fim);
        return {
            ...item,
            id:         `task-${index}`,
            index,
            dataInicio,
            dataFim,
            duracao:    diffDays(dataInicio, dataFim),
            colorClass: getResponsavelClass(item.resp),
        };
    });
}

const parsedData = buildParsedData();

// Calcular limites do eixo temporal
const minDate = new Date(Math.min(...parsedData.map(d => d.dataInicio)));
const maxDate = new Date(Math.max(...parsedData.map(d => d.dataFim)));
minDate.setDate(minDate.getDate() - 3);
maxDate.setDate(maxDate.getDate() + 8);
const totalDuration = maxDate - minDate;

// Datas únicas para marcadores do eixo
const uniqueDatesMap = new Map();
parsedData.forEach(task => {
    uniqueDatesMap.set(task.dataInicio.getTime(), task.dataInicio);
    uniqueDatesMap.set(task.dataFim.getTime(),    task.dataFim);
});
const uniqueDates = Array.from(uniqueDatesMap.values()).sort((a, b) => a - b);
