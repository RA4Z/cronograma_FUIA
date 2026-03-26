// 1. Dados do Projeto
const data = [
    { atividade: "Conexão com base de dados", resp: "Gabriel Volles Marinho", inicio: "23/03/2026", fim: "27/03/2026" },
    { atividade: "Segurança/autenticação", resp: "Gabriel Volles Marinho", inicio: "27/03/2026", fim: "08/04/2026" },
    { atividade: "Sistema resposta fornecedores", resp: "Gabriel Volles Marinho", inicio: "08/04/2026", fim: "13/04/2026" },
    { atividade: "Endpoint interface gerencial", resp: "Gabriel Volles Marinho", inicio: "13/04/2026", fim: "01/05/2026" },
    { atividade: "Interface fornecedores", resp: "Robert Aron Zimmermann", inicio: "13/04/2026", fim: "01/05/2026" },
    { atividade: "Interface gerencial", resp: "Robert Aron Zimmermann", inicio: "01/05/2026", fim: "19/05/2026" },
    { atividade: "Treinamento IA", resp: "Todos", inicio: "19/05/2026", fim: "20/06/2026" },
    { atividade: "Lançamento FUIA", resp: "Todos", inicio: "20/06/2026", fim: "24/06/2026" }
];

// 2. Funções Auxiliares de Data
function parseDate(dateStr) {
    const [dia, mes, ano] = dateStr.split('/');
    return new Date(ano, mes - 1, dia);
}

function diffDays(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatShortDate(date) {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${date.getDate()} ${meses[date.getMonth()]}`;
}

// Mapeamento e processamento dos dados
const parsedData = data.map((item, index) => ({
    ...item,
    id: `task-${index}`, // ID único para ligar gráfico e tabela
    dataInicio: parseDate(item.inicio),
    dataFim: parseDate(item.fim),
    duracao: diffDays(parseDate(item.inicio), parseDate(item.fim))
}));

const minDate = new Date(Math.min(...parsedData.map(d => d.dataInicio)));
const maxDate = new Date(Math.max(...parsedData.map(d => d.dataFim)));

// Margem de respiro no gráfico (3 dias antes e 5 depois para caber o texto)
minDate.setDate(minDate.getDate() - 3);
maxDate.setDate(maxDate.getDate() + 5);
const totalDuration = maxDate - minDate;

// Coletar todas as datas únicas do projeto para os marcadores (Início e Fim)
const uniqueDatesMap = new Map();
parsedData.forEach(task => {
    uniqueDatesMap.set(task.dataInicio.getTime(), task.dataInicio);
    uniqueDatesMap.set(task.dataFim.getTime(), task.dataFim);
});
const uniqueDates = Array.from(uniqueDatesMap.values()).sort((a, b) => a - b);


// 3. Renderização
const timelineAxis = document.getElementById('timelineAxis');
const gridContainer = document.getElementById('gridContainer');
const tasksContainer = document.getElementById('tasksContainer');
const tableBody = document.getElementById('tableBody');

// Renderizar Eixo Superior (Datas exatas) e Linhas de Grade
uniqueDates.forEach(date => {
    const leftPercent = ((date - minDate) / totalDuration) * 100;
    
    // Marcador da Data
    const tick = document.createElement('div');
    tick.className = 'timeline-tick';
    tick.style.left = `${leftPercent}%`;
    tick.innerHTML = `
        <div class="tick-label">${formatShortDate(date)}</div>
        <div class="tick-dot"></div>
    `;
    timelineAxis.appendChild(tick);

    // Linha de Grade Vertical
    const gridLine = document.createElement('div');
    gridLine.className = 'grid-line';
    gridLine.style.left = `${leftPercent}%`;
    gridContainer.appendChild(gridLine);
});

// Renderizar Barras e Tabela
parsedData.forEach((task) => {
    const leftPercent = ((task.dataInicio - minDate) / totalDuration) * 100;
    let widthPercent = ((task.dataFim - task.dataInicio) / totalDuration) * 100;
    if (widthPercent < 0.5) widthPercent = 0.5; // Largura mínima para ser clicável/visível

    // Decidir Cores
    let colorClass = 'gabriel';
    let bgClass = 'bg-gabriel';
    if(task.resp.includes('Robert')) { colorClass = 'robert'; bgClass = 'bg-robert'; }
    if(task.resp.includes('Todos')) { colorClass = 'todos'; bgClass = 'bg-todos'; }

    // Decidir posição do texto (dentro ou fora)
    // Se a largura for menor que 15%, o texto vai para fora à direita
    let textHTML = '';
    if (widthPercent > 12) {
        textHTML = `<span class="task-text-inner">${task.atividade}</span>`;
    } else {
        textHTML = `<span class="task-text-outer">${task.atividade}</span>`;
    }

    // Criar Linha do Gráfico
    const rowDiv = document.createElement('div');
    rowDiv.className = 'task-row';
    rowDiv.setAttribute('data-target-id', task.id); // Data attribute para o hover
    
    rowDiv.innerHTML = `
        <div class="task-bar ${bgClass}" style="left: ${leftPercent}%; width: ${widthPercent}%;" title="${task.atividade} (${task.duracao} dias)">
            ${textHTML}
        </div>
    `;
    tasksContainer.appendChild(rowDiv);

    // Criar Linha da Tabela
    const tr = document.createElement('tr');
    tr.setAttribute('data-target-id', task.id); // Data attribute para o hover
    
    tr.innerHTML = `
        <td style="font-weight: 500; color: #0f172a;">${task.atividade}</td>
        <td><span class="badge ${colorClass}">${task.resp}</span></td>
        <td>${task.inicio}</td>
        <td>${task.fim}</td>
        <td>${task.duracao} dias</td>
    `;
    tableBody.appendChild(tr);
});

// 4. Lógica de Hover Bidirecional (Gráfico <-> Tabela)
const allTaskRows = document.querySelectorAll('.task-row');
const allTableRows = document.querySelectorAll('tbody tr');

function addHighlight(id) {
    document.querySelector(`.task-row[data-target-id="${id}"]`).classList.add('highlighted');
    document.querySelector(`tr[data-target-id="${id}"]`).classList.add('highlighted');
}

function removeHighlight(id) {
    document.querySelector(`.task-row[data-target-id="${id}"]`).classList.remove('highlighted');
    document.querySelector(`tr[data-target-id="${id}"]`).classList.remove('highlighted');
}

// Eventos para o gráfico
allTaskRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
        addHighlight(this.getAttribute('data-target-id'));
    });
    row.addEventListener('mouseleave', function() {
        removeHighlight(this.getAttribute('data-target-id'));
    });
});

// Eventos para a tabela
allTableRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
        addHighlight(this.getAttribute('data-target-id'));
    });
    row.addEventListener('mouseleave', function() {
        removeHighlight(this.getAttribute('data-target-id'));
    });
});