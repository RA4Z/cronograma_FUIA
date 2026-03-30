// ─── COMPONENT: ProgCard ─────────────────────────────────────────────────────

const RING_R = 46;
const CIRC   = 2 * Math.PI * RING_R;

const STROKE_COLORS = {
    gabriel: '#4f7dff', robert: '#c084fc', green: '#34d399',
    orange:  '#fb923c', rose:   '#fb7185', cyan:  '#22d3ee',
    yellow:  '#fbbf24', indigo: '#818cf8',
};

function ProgCard({ task, onEdit }) {
    const prog   = task.progress;
    const offset = CIRC * (1 - prog / 100);
    const color  = colorById(task.respColor || 'gabriel');
    const st     = statusById(task.status);
    const dur    = diffDays(parseDate(task.inicio), parseDate(task.fim));
    const sc     = STROKE_COLORS[color.id] || '#4f7dff';

    return (
        <div className="prog-card" style={{ '--card-color': sc }} onClick={() => onEdit(task)}>
            {/* Top accent line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg,${sc},${sc}99)`,
                borderRadius: 'var(--r-xl) var(--r-xl) 0 0'
            }} />

            <div className="pc-header">
                <p className="pc-name">{task.atividade}</p>
                <span className="pc-pct" style={{ color: sc }}>{prog}%</span>
            </div>

            {/* Ring chart */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                    <svg className="ring-svg" width={110} height={110} viewBox="0 0 110 110">
                        <circle className="ring-track" cx={55} cy={55} r={RING_R} stroke="var(--border)" />
                        <circle className="ring-fill"  cx={55} cy={55} r={RING_R}
                            stroke={sc}
                            strokeDasharray={CIRC}
                            strokeDashoffset={offset} />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>{prog}%</div>
                        <div style={{ fontSize: '.6rem', color: 'var(--text-3)', marginTop: 2 }}>{dur}d</div>
                    </div>
                </div>
            </div>

            <div className="pc-bar-track">
                <div className={`pc-bar-fill ${color.cls}`} style={{ width: `${prog}%` }} />
            </div>

            <div className="pc-meta">
                <div>
                    <span className={`badge ${color.badge}`} style={{ fontSize: '.65rem' }}>{task.resp}</span>
                    <div className="pc-dates" style={{ marginTop: 4 }}>{task.inicio} → {task.fim}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className={`status-badge ${st.cls}`}>{st.label}</span>
                    <div className="pc-edit-hint" style={{ marginTop: 4 }}>✏ Editar</div>
                </div>
            </div>
        </div>
    );
}

// ─── COMPONENT: AnalyticsView ─────────────────────────────────────────────────

function AnalyticsView({ project }) {
    const { tasks, members } = project;
    const health  = calcHealthScore(tasks);
    const avgProg = tasks.length ? Math.round(tasks.reduce((a, t) => a + t.progress, 0) / tasks.length) : 0;
    const done    = tasks.filter(t => t.status === 'done').length;
    const blocked = tasks.filter(t => t.status === 'blocked').length;
    const inProg  = tasks.filter(t => t.status === 'in-progress').length;

    const healthColor = health >= 75 ? '#34d399' : health >= 50 ? '#fbbf24' : '#f87171';

    const memberStats = members.map(m => {
        const myTasks = tasks.filter(t => t.resp === m.name || (m.name === 'Todos' && t.resp === 'Todos'));
        const myProg  = myTasks.length ? Math.round(myTasks.reduce((a, t) => a + t.progress, 0) / myTasks.length) : 0;
        return { ...m, taskCount: myTasks.length, avgProg: myProg };
    });

    const statusDist = STATUS_OPTS.map(s => ({
        ...s, count: tasks.filter(t => t.status === s.id).length,
    }));

    return (
        <div className="analytics-grid">
            {/* Health card */}
            <div className="glass-card">
                <div className="card-head">
                    <div>
                        <div className="card-title">Saúde do Projeto</div>
                        <div className="card-sub">Score calculado automaticamente</div>
                    </div>
                </div>
                <div className="card-body health-score">
                    <div style={{ fontSize: '.72rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>Score</div>
                    <div className="health-num" style={{ color: healthColor }}>{health}</div>
                    <div className="health-label" style={{ color: healthColor }}>
                        {health >= 75 ? 'Excelente' : health >= 50 ? 'Atenção' : 'Crítico'}
                    </div>
                    <div className="health-bar">
                        <div className="health-fill" style={{ width: `${health}%`, background: `linear-gradient(90deg,${healthColor}88,${healthColor})` }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 16 }}>
                        {[
                            { l: 'Total',      v: tasks.length, c: 'var(--text-2)' },
                            { l: 'Concluídas', v: done,         c: '#34d399' },
                            { l: 'Andamento',  v: inProg,       c: '#fbbf24' },
                            { l: 'Bloqueadas', v: blocked,      c: '#f87171' },
                        ].map(x => (
                            <div key={x.l} style={{ textAlign: 'center', background: 'var(--bg-glass)', borderRadius: 'var(--r-md)', padding: '10px 4px' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: x.c }}>{x.v}</div>
                                <div style={{ fontSize: '.62rem', color: 'var(--text-3)', marginTop: 2 }}>{x.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team card */}
            <div className="glass-card">
                <div className="card-head">
                    <div>
                        <div className="card-title">Equipe</div>
                        <div className="card-sub">Progresso por membro</div>
                    </div>
                </div>
                <div className="card-body">
                    {memberStats.length === 0 && (
                        <div style={{ color: 'var(--text-3)', fontSize: '.82rem', textAlign: 'center', padding: '20px 0' }}>
                            Nenhum membro adicionado
                        </div>
                    )}
                    {memberStats.map(m => {
                        const c = colorById(m.color);
                        return (
                            <div key={m.name} className="team-row">
                                <div className="team-avatar" style={{ background: c.hex + '33', border: `2px solid ${c.hex}44` }}>
                                    <span style={{ color: c.hex, fontWeight: 800 }}>{m.name.charAt(0)}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="team-name">{m.name}</div>
                                    <div className="team-tasks">{m.taskCount} tarefas · {m.avgProg}% médio</div>
                                </div>
                                <div className="team-prog">
                                    <div className="prog-track" style={{ flex: 1 }}>
                                        <div className={`prog-fill ${c.cls}`} style={{ width: `${m.avgProg}%` }} />
                                    </div>
                                    <span className="prog-pct">{m.avgProg}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Status distribution card */}
            <div className="glass-card">
                <div className="card-head">
                    <div><div className="card-title">Distribuição de Status</div></div>
                </div>
                <div className="card-body">
                    {statusDist.map(s => (
                        <div key={s.id} style={{ marginBottom: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span className={`status-badge ${s.cls}`}>{s.label}</span>
                                <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text-2)' }}>{s.count}</span>
                            </div>
                            <div className="prog-track" style={{ height: 8 }}>
                                <div style={{
                                    height: '100%', borderRadius: 'var(--r-full)',
                                    width: tasks.length ? `${(s.count / tasks.length) * 100}%` : '0%',
                                    background: s.id === 'done' ? '#34d399' : s.id === 'in-progress' ? '#fbbf24' : s.id === 'blocked' ? '#f87171' : '#475569',
                                    transition: 'width .8s var(--ease-out)'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overall progress card */}
            <div className="glass-card">
                <div className="card-head">
                    <div>
                        <div className="card-title">Progresso Geral</div>
                        <div className="card-sub">Média ponderada das etapas</div>
                    </div>
                </div>
                <div className="card-body" style={{ textAlign: 'center', paddingTop: 30 }}>
                    <div style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
                        {avgProg}%
                    </div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-3)', margin: '8px 0 20px' }}>Concluído até agora</div>
                    <div className="health-bar" style={{ height: 14 }}>
                        <div className="health-fill" style={{ width: `${avgProg}%`, background: 'linear-gradient(90deg,#4f7dff,#9b5de5)' }} />
                    </div>
                    {tasks.length > 0 && (
                        <div style={{ marginTop: 20, textAlign: 'left' }}>
                            {tasks.map(t => {
                                const c = colorById(t.respColor || 'gabriel');
                                return (
                                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.hex, flexShrink: 0 }} />
                                        <span style={{ fontSize: '.72rem', color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {t.atividade}
                                        </span>
                                        <div className="prog-track" style={{ width: 80, flexShrink: 0 }}>
                                            <div className={`prog-fill ${c.cls}`} style={{ width: `${t.progress}%` }} />
                                        </div>
                                        <span style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--text-3)', width: 30, textAlign: 'right' }}>
                                            {t.progress}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
