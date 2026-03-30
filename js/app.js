// =====================================================
// APP.JS — Orquestração Principal
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar tema
    initTheme();

    // 2. Renderizar componentes
    renderGantt();
    renderTable();
    renderProgressGrid();
    updateHeaderStats();

    // 3. Inicializar modal
    initModal();

    // 4. Navegação entre views
    initNavigation();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();

            const viewId = item.getAttribute('data-view');

            // Atualizar nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Mostrar view correta
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(`view-${viewId}`);
            if (targetView) targetView.classList.add('active');
        });
    });
}

function updateHeaderStats() {
    const statsEl = document.getElementById('headerStats');

    const total     = parsedData.length;
    const done      = progressState.filter(s => s.status === 'done').length;
    const inProg    = progressState.filter(s => s.status === 'in-progress').length;
    const avgProg   = Math.round(progressState.reduce((a, s) => a + s.progress, 0) / total);

    // Datas
    const projectStart = parsedData[0].dataInicio;
    const projectEnd   = parsedData[parsedData.length - 1].dataFim;
    const today        = new Date();
    const elapsed      = Math.max(0, diffDays(projectStart, today));
    const totalDays    = diffDays(projectStart, projectEnd);
    const timeProgress = Math.min(100, Math.round((elapsed / totalDays) * 100));

    statsEl.innerHTML = `
        <div class="stat-chip">
            <span class="stat-value">${done}/${total}</span>
            <span class="stat-label">Concluídas</span>
        </div>
        <div class="stat-chip">
            <span class="stat-value">${inProg}</span>
            <span class="stat-label">Em andamento</span>
        </div>
        <div class="stat-chip">
            <span class="stat-value">${avgProg}%</span>
            <span class="stat-label">Progresso geral</span>
        </div>
        <div class="stat-chip">
            <span class="stat-value">${timeProgress}%</span>
            <span class="stat-label">Tempo decorrido</span>
        </div>
    `;
}
