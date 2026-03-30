// ─── COMPONENT: GanttView ────────────────────────────────────────────────────

function GanttView({ tasks, members, onEdit, hoverId, setHoverId }) {
    const meta = React.useMemo(() => buildGanttMeta(tasks), [tasks]);

    if (!meta || !tasks.length) return (
        <div className="gantt-wrap">
            <div className="empty">
                <div className="empty-icon">📅</div>
                <div className="empty-title">Sem etapas ainda</div>
                <div className="empty-sub">Adicione etapas para visualizar o cronograma</div>
            </div>
        </div>
    );

    const { minD, totalMs, ticks } = meta;
    const toLeft = d => ((parseDate(typeof d === 'string' ? d : fmtDate(d)) - minD) / totalMs) * 100;
    const today = new Date();
    const todayLeft = ((today - minD) / totalMs) * 100;

    return (
        <div className="gantt-wrap">
            <div className="gantt-inner">
                {/* Grid lines */}
                <div className="gantt-grid">
                    {ticks.map((t, i) => (
                        <div key={i} className="gantt-gridline" style={{ left: `${toLeft(t)}%` }} />
                    ))}
                    {todayLeft >= 0 && todayLeft <= 100 && (
                        <div className="gantt-today-line" style={{ left: `${todayLeft}%` }}>
                            <span className="today-label">Hoje</span>
                        </div>
                    )}
                </div>

                {/* Axis with tick labels */}
                <div className="gantt-axis">
                    <div className="gantt-axis-line" />
                    {ticks.map((t, i) => (
                        <div key={i} className="gtick" style={{ left: `${toLeft(t)}%` }}>
                            <span className="gtick-label">{fmtShort(t)}</span>
                            <span className="gtick-dot" />
                        </div>
                    ))}
                </div>

                {/* Bars */}
                <div className="tasks-area">
                    {tasks.map(task => {
                        const leftPct = ((parseDate(task.inicio) - minD) / totalMs) * 100;
                        let widthPct = ((parseDate(task.fim) - parseDate(task.inicio)) / totalMs) * 100;
                        if (widthPct < 0.5) widthPct = 0.5;
                        const prog = task.progress;
                        const color = colorById(task.respColor || 'gabriel');
                        return (
                            <div
                                key={task.id}
                                className={`task-row ${hoverId === task.id ? 'hl' : ''}`}
                                onMouseEnter={() => setHoverId(task.id)}
                                onMouseLeave={() => setHoverId(null)}
                                onClick={() => onEdit(task)}>
                                <div
                                    className={`tbar ${color.cls}`}
                                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                    title={`${task.atividade} — ${prog}%`}>
                                    <div className="bar-done-layer" style={{ width: `${prog}%` }} />
                                    <div className="bar-todo-layer" style={{ left: `${prog}%`, width: `${100 - prog}%` }} />
                                    {widthPct > 10
                                        ? <span className="bar-text-in">{task.atividade}</span>
                                        : <span className="bar-text-out">{task.atividade}</span>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
