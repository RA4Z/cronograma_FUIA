// =====================================================
// GANTT.JS — Renderização do Gráfico de Gantt
// =====================================================

function renderGantt() {
    const timelineAxis  = document.getElementById('timelineAxis');
    const gridContainer = document.getElementById('gridContainer');
    const tasksContainer = document.getElementById('tasksContainer');

    timelineAxis.innerHTML  = '';
    gridContainer.innerHTML = '';
    tasksContainer.innerHTML = '';

    // Eixo e grade
    uniqueDates.forEach(date => {
        const leftPct = ((date - minDate) / totalDuration) * 100;

        // Marcador de data
        const tick = document.createElement('div');
        tick.className = 'timeline-tick';
        tick.style.left = `${leftPct}%`;
        tick.innerHTML = `
            <div class="tick-label">${formatShortDate(date)}</div>
            <div class="tick-dot"></div>
        `;
        timelineAxis.appendChild(tick);

        // Linha de grade vertical
        const gridLine = document.createElement('div');
        gridLine.className = 'grid-line';
        gridLine.style.left = `${leftPct}%`;
        gridContainer.appendChild(gridLine);
    });

    // Barras de tarefas
    parsedData.forEach(task => {
        const leftPct  = ((task.dataInicio - minDate) / totalDuration) * 100;
        let   widthPct = ((task.dataFim - task.dataInicio) / totalDuration) * 100;
        if (widthPct < 0.5) widthPct = 0.5;

        const state    = progressState[task.index];
        const progress = state.progress;

        // Texto dentro ou fora
        const textHTML = widthPct > 11
            ? `<span class="task-text-inner">${task.atividade}</span>`
            : `<span class="task-text-outer">${task.atividade}</span>`;

        // Overlay de progresso (parte clara = concluído, listrada = restante)
        const progressOverlayHTML = `
            <div class="bar-progress-overlay" style="width:${progress}%"></div>
            <div class="bar-progress-striped" style="width:${100 - progress}%; left:${progress}%"></div>
        `;

        const rowDiv = document.createElement('div');
        rowDiv.className = 'task-row';
        rowDiv.setAttribute('data-target-id', task.id);

        rowDiv.innerHTML = `
            <div class="task-bar bg-${task.colorClass}"
                 style="left:${leftPct}%; width:${widthPct}%;"
                 title="${task.atividade} — ${progress}% concluído (${task.duracao} dias)">
                ${progressOverlayHTML}
                ${textHTML}
            </div>
        `;
        tasksContainer.appendChild(rowDiv);
    });

    // Hover bidirecional
    bindHoverEvents();
}

function updateGanttBar(index) {
    const task     = parsedData[index];
    const state    = progressState[index];
    const progress = state.progress;
    const bar      = document.querySelector(`.task-row[data-target-id="${task.id}"] .task-bar`);
    if (!bar) return;

    const overlay  = bar.querySelector('.bar-progress-overlay');
    const striped  = bar.querySelector('.bar-progress-striped');
    if (overlay) overlay.style.width = `${progress}%`;
    if (striped) {
        striped.style.width = `${100 - progress}%`;
        striped.style.left  = `${progress}%`;
    }
    bar.title = `${task.atividade} — ${progress}% concluído (${task.duracao} dias)`;
}

function bindHoverEvents() {
    const allTaskRows  = document.querySelectorAll('.task-row');
    const allTableRows = document.querySelectorAll('tbody tr');

    function addHighlight(id) {
        document.querySelector(`.task-row[data-target-id="${id}"]`)?.classList.add('highlighted');
        document.querySelector(`tr[data-target-id="${id}"]`)?.classList.add('highlighted');
    }

    function removeHighlight(id) {
        document.querySelector(`.task-row[data-target-id="${id}"]`)?.classList.remove('highlighted');
        document.querySelector(`tr[data-target-id="${id}"]`)?.classList.remove('highlighted');
    }

    allTaskRows.forEach(row => {
        row.addEventListener('mouseenter', () => addHighlight(row.getAttribute('data-target-id')));
        row.addEventListener('mouseleave', () => removeHighlight(row.getAttribute('data-target-id')));
    });

    allTableRows.forEach(row => {
        row.addEventListener('mouseenter', () => addHighlight(row.getAttribute('data-target-id')));
        row.addEventListener('mouseleave', () => removeHighlight(row.getAttribute('data-target-id')));
    });
}
