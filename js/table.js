// =====================================================
// TABLE.JS — Renderização da Tabela
// =====================================================

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    parsedData.forEach(task => {
        const state    = progressState[task.index];
        const progress = state.progress;
        const status   = state.status;

        const tr = document.createElement('tr');
        tr.setAttribute('data-target-id', task.id);

        tr.innerHTML = `
            <td style="font-weight:600;">${task.atividade}</td>
            <td><span class="badge ${task.colorClass}">${task.resp}</span></td>
            <td>${task.inicio}</td>
            <td>${task.fim}</td>
            <td>${task.duracao} dias</td>
            <td class="td-progress">
                <div class="table-progress-wrap">
                    <div class="table-progress-bar">
                        <div class="table-progress-fill ${task.colorClass}"
                             id="tpf-${task.index}"
                             style="width:${progress}%"></div>
                    </div>
                    <span class="table-progress-pct" id="tpp-${task.index}">${progress}%</span>
                    <button class="edit-progress-btn" data-index="${task.index}">Editar</button>
                </div>
                <div style="margin-top:4px;">
                    <span class="status-badge ${status}" id="tsb-${task.index}">
                        ${getStatusLabel(status)}
                    </span>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Botões de editar
    document.querySelectorAll('.edit-progress-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            openModal(+btn.getAttribute('data-index'));
        });
    });
}

function updateTableRow(index) {
    const state    = progressState[index];
    const progress = state.progress;
    const status   = state.status;

    const fill  = document.getElementById(`tpf-${index}`);
    const pct   = document.getElementById(`tpp-${index}`);
    const badge = document.getElementById(`tsb-${index}`);

    if (fill)  fill.style.width  = `${progress}%`;
    if (pct)   pct.textContent   = `${progress}%`;
    if (badge) {
        badge.className   = `status-badge ${status}`;
        badge.textContent = getStatusLabel(status);
    }
}
