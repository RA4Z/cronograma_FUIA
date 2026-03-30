// ─── COMPONENT: TableView ────────────────────────────────────────────────────

function TableView({ tasks, onEdit, hoverId, setHoverId }) {
    if (!tasks.length) return (
        <div className="card-body">
            <div className="empty">
                <div className="empty-icon">📋</div>
                <div className="empty-title">Nenhuma tarefa cadastrada</div>
            </div>
        </div>
    );

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="tbl">
                <thead>
                    <tr>
                        <th>Etapa</th>
                        <th>Responsável</th>
                        <th>Início</th>
                        <th>Fim</th>
                        <th>Duração</th>
                        <th>Progresso</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => {
                        const dur   = diffDays(parseDate(task.inicio), parseDate(task.fim));
                        const color = colorById(task.respColor || 'gabriel');
                        const st    = statusById(task.status);
                        const prog  = task.progress;
                        return (
                            <tr
                                key={task.id}
                                className={hoverId === task.id ? 'hl' : ''}
                                onMouseEnter={() => setHoverId(task.id)}
                                onMouseLeave={() => setHoverId(null)}
                                onClick={() => onEdit(task)}>
                                <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {task.atividade}
                                </td>
                                <td><span className={`badge ${color.badge}`}>{task.resp}</span></td>
                                <td style={{ whiteSpace: 'nowrap' }}>{task.inicio}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{task.fim}</td>
                                <td>{dur}d</td>
                                <td>
                                    <div className="inline-prog">
                                        <div className="prog-track">
                                            <div className={`prog-fill ${color.cls}`} style={{ width: `${prog}%` }} />
                                        </div>
                                        <span className="prog-pct">{prog}%</span>
                                    </div>
                                </td>
                                <td><span className={`status-badge ${st.cls}`}>{st.label}</span></td>
                                <td onClick={e => e.stopPropagation()}>
                                    <button className="btn btn-ghost btn-xs" onClick={() => onEdit(task)}>✏</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
