// =====================================================
// PROGRESS.JS — Cards de Progresso e Modal
// =====================================================

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function renderProgressGrid() {
    const grid = document.getElementById('progressGrid');
    grid.innerHTML = '';

    parsedData.forEach(task => {
        const state    = progressState[task.index];
        const progress = state.progress;
        const status   = state.status;
        const offset   = RING_CIRCUMFERENCE * (1 - progress / 100);

        const card = document.createElement('div');
        card.className = `progress-card ${task.colorClass}`;
        card.setAttribute('data-index', task.index);

        card.innerHTML = `
            <div class="card-top">
                <p class="card-activity">${task.atividade}</p>
                <span class="card-pct ${task.colorClass}" id="cpct-${task.index}">${progress}%</span>
            </div>

            <div class="ring-container">
                <div class="ring-wrapper">
                    <svg class="progress-ring-svg" width="128" height="128" viewBox="0 0 128 128">
                        <circle class="progress-ring-track" cx="64" cy="64" r="${RING_RADIUS}"/>
                        <circle class="progress-ring-fill ${task.colorClass}"
                                id="ring-${task.index}"
                                cx="64" cy="64" r="${RING_RADIUS}"
                                stroke-dasharray="${RING_CIRCUMFERENCE}"
                                stroke-dashoffset="${offset}"/>
                    </svg>
                    <div class="ring-center-text">
                        <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;color:var(--text-primary);line-height:1;" id="ring-pct-${task.index}">${progress}%</div>
                        <div style="font-size:0.65rem;color:var(--text-muted);font-weight:500;margin-top:2px;">${task.duracao}d</div>
                    </div>
                </div>
            </div>

            <div class="card-bar-track">
                <div class="card-bar-fill ${task.colorClass}" id="cbf-${task.index}" style="width:${progress}%"></div>
            </div>

            <div class="card-meta">
                <div>
                    <span class="badge ${task.colorClass}" style="font-size:0.68rem;">${task.resp}</span>
                    <div class="card-dates" style="margin-top:5px;">${task.inicio} → ${task.fim}</div>
                </div>
                <div>
                    <span class="status-badge ${status}" id="csb-${task.index}">${getStatusLabel(status)}</span>
                    <div class="card-edit-hint" style="text-align:right;margin-top:4px;">✏ Editar</div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => openModal(task.index));
        grid.appendChild(card);
    });
}

function updateProgressCard(index) {
    const state    = progressState[index];
    const progress = state.progress;
    const status   = state.status;
    const offset   = RING_CIRCUMFERENCE * (1 - progress / 100);

    const ring     = document.getElementById(`ring-${index}`);
    const ringPct  = document.getElementById(`ring-pct-${index}`);
    const cardPct  = document.getElementById(`cpct-${index}`);
    const barFill  = document.getElementById(`cbf-${index}`);
    const statusBg = document.getElementById(`csb-${index}`);

    if (ring)     ring.style.strokeDashoffset = offset;
    if (ringPct)  ringPct.textContent = `${progress}%`;
    if (cardPct)  cardPct.textContent = `${progress}%`;
    if (barFill)  barFill.style.width = `${progress}%`;
    if (statusBg) {
        statusBg.className   = `status-badge ${status}`;
        statusBg.textContent = getStatusLabel(status);
    }
}

// ===========================
// MODAL
// ===========================
let modalCurrentIndex = null;

function openModal(index) {
    const task  = parsedData[index];
    const state = progressState[index];

    modalCurrentIndex = index;

    document.getElementById('modalTaskName').textContent = task.atividade;
    document.getElementById('progressSlider').value     = state.progress;
    document.getElementById('sliderValue').textContent  = `${state.progress}%`;

    // Atualizar status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-status') === state.status);
    });

    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    modalCurrentIndex = null;
}

function saveModal() {
    if (modalCurrentIndex === null) return;

    const progress = +document.getElementById('progressSlider').value;
    const statusBtn = document.querySelector('.status-btn.active');
    const status    = statusBtn ? statusBtn.getAttribute('data-status') : 'pending';

    progressState[modalCurrentIndex] = { progress, status };
    saveProgressState(progressState);

    // Atualizar tudo
    updateProgressCard(modalCurrentIndex);
    updateTableRow(modalCurrentIndex);
    updateGanttBar(modalCurrentIndex);
    updateHeaderStats();

    closeModal();
}

function initModal() {
    const slider   = document.getElementById('progressSlider');
    const overlay  = document.getElementById('modalOverlay');

    slider.addEventListener('input', function () {
        document.getElementById('sliderValue').textContent = `${this.value}%`;
    });

    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Auto-fill slider baseado no status
            const autoMap = { pending: 0, 'in-progress': null, done: 100, blocked: null };
            const auto    = autoMap[this.getAttribute('data-status')];
            if (auto !== null) {
                slider.value = auto;
                document.getElementById('sliderValue').textContent = `${auto}%`;
            }
        });
    });

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    document.getElementById('modalSave').addEventListener('click', saveModal);

    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
    });
}
