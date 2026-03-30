// ─── MODAL: Task ─────────────────────────────────────────────────────────────

function TaskModal({ task, members, onSave, onDelete, onClose }) {
    const [form, setForm] = React.useState({
        atividade: task?.atividade || '',
        resp: task?.resp || members[0]?.name || '',
        respColor: task?.respColor || members[0]?.color || 'gabriel',
        inicio: task?.inicio || fmtDate(new Date()),
        fim: task?.fim || fmtDate(addDays(new Date(), 7)),
        progress: task?.progress ?? 0,
        status: task?.status || 'pending',
        notes: task?.notes || '',
    });

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const isNew = !task?.id;

    return (
        <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal modal-lg">
                <div className="mhead">
                    <h3>{isNew ? '➕ Nova Etapa' : '✏️ Editar Etapa'}</h3>
                    <button className="mclose" onClick={onClose}>✕</button>
                </div>
                <div className="mbody">
                    <div className="field">
                        <label>Nome da Etapa</label>
                        <input className="finput" value={form.atividade}
                            placeholder="Ex: Desenvolvimento do módulo X"
                            onChange={e => set('atividade', e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Responsável</label>
                        <select className="finput" value={form.resp}
                            onChange={e => {
                                const m = members.find(x => x.name === e.target.value);
                                set('resp', e.target.value);
                                if (m) set('respColor', m.color);
                            }}>
                            {members.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                            <option value="Todos">Todos</option>
                        </select>
                    </div>
                    <div className="field-row">
                        <div className="field" style={{ margin: 0 }}>
                            <label>Data de Início</label>
                            <input type="text" className="finput" value={form.inicio}
                                placeholder="dd/mm/aaaa"
                                onChange={e => set('inicio', e.target.value)} />
                        </div>
                        <div className="field" style={{ margin: 0 }}>
                            <label>Data de Término</label>
                            <input type="text" className="finput" value={form.fim}
                                placeholder="dd/mm/aaaa"
                                onChange={e => set('fim', e.target.value)} />
                        </div>
                    </div>
                    <div className="divider" />
                    <div className="field" style={{ marginBottom: 8 }}>
                        <label>Progresso — <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{form.progress}%</span></label>
                        <div className="slider-val">{form.progress}%</div>
                        <input type="range" className="fslider" min={0} max={100}
                            value={form.progress}
                            onChange={e => set('progress', +e.target.value)} />
                        <div className="slider-labels"><span>0%</span><span>50%</span><span>100%</span></div>
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                        <label>Status</label>
                        <div className="status-row">
                            {STATUS_OPTS.map(s => (
                                <button key={s.id}
                                    className={`sbtn ${form.status === s.id ? 'active' : ''}`}
                                    data-s={s.id}
                                    onClick={() => {
                                        set('status', s.id);
                                        if (s.id === 'done') set('progress', 100);
                                        if (s.id === 'pending') set('progress', 0);
                                    }}>{s.label}</button>
                            ))}
                        </div>
                    </div>
                    <div className="field mt-16" style={{ marginBottom: 0 }}>
                        <label>Notas (opcional)</label>
                        <textarea className="finput" value={form.notes}
                            placeholder="Observações sobre essa etapa..."
                            onChange={e => set('notes', e.target.value)}
                            style={{ minHeight: 56 }} />
                    </div>
                </div>
                <div className="mfooter">
                    {!isNew && (
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(task.id)}>
                            🗑 Excluir
                        </button>
                    )}
                    <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary"
                        onClick={() => onSave({ ...task, ...form, id: task?.id || uid() })}>
                        {isNew ? '✓ Criar Etapa' : '✓ Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── MODAL: Project ───────────────────────────────────────────────────────────

function ProjectModal({ project, onSave, onClose }) {
    const [form, setForm] = React.useState({
        name: project?.name || '',
        description: project?.description || '',
        color: project?.color || 'gabriel',
        members: project?.members || [],
    });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const isNew = !project?.id;

    return (
        <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="mhead">
                    <h3>{isNew ? '🗂 Novo Cronograma' : '✏️ Editar Cronograma'}</h3>
                    <button className="mclose" onClick={onClose}>✕</button>
                </div>
                <div className="mbody">
                    <div className="field">
                        <label>Nome do Projeto</label>
                        <input className="finput" value={form.name}
                            placeholder="Ex: FUIA — Módulo de Pagamentos"
                            onChange={e => set('name', e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Descrição</label>
                        <textarea className="finput" value={form.description}
                            placeholder="Breve descrição do projeto..."
                            onChange={e => set('description', e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Cor do Projeto</label>
                        <ColorPicker value={form.color} onChange={v => set('color', v)} />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                        <label>Membros da Equipe</label>
                        <MembersInput members={form.members} onChange={v => set('members', v)} />
                        <div style={{ fontSize: '.68rem', color: 'var(--text-3)', marginTop: 4 }}>
                            Digite um nome e pressione Enter para adicionar membros personalizados
                        </div>
                    </div>
                </div>
                <div className="mfooter">
                    <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary"
                        onClick={() => form.name.trim() && onSave({
                            ...project, id: project?.id || uid(),
                            tasks: project?.tasks || [], ...form
                        })}>
                        {isNew ? '✓ Criar Projeto' : '✓ Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function App() {
    const { useState, useEffect, useMemo } = React;

    const [state, setState] = useState(() => {
        const saved = loadState();
        if (saved && saved.projects && saved.projects.length > 0) {
            return saved;
        }
        const initialProjs = defaultProjects();
        return {
            projects: initialProjs,
            activeProjId: initialProjs[0].id,
            activity: [newActivity('Projeto iniciado', 'FUIA carregado', 'gabriel')],
            theme: localStorage.getItem('fuia-theme') || 'dark'
        };
    });
    const [projects, setProjects]         = useState(state.projects);
    const [activeProjId, setActiveProjId] = useState(state.activeProjId);
    const [activity, setActivity]         = useState(state.activity);
    const [theme, setTheme]               = useState(state.theme);

    const [tab, setTab] = useState('gantt');
    const [hoverId, setHoverId] = useState(null);
    const [editTask, setEditTask] = useState(null);
    const [editProject, setEditProject] = useState(null);
    const [showNewProject, setShowNewProject] = useState(false);
    const [showNewTask, setShowNewTask] = useState(false);
    const activeProj = projects.find(p => p.id === activeProjId) || projects[0];

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('fuia-theme', theme);
    }, [theme]);

    useEffect(() => {
        saveState({ projects, activeProjId, activity });
    }, [projects, activeProjId, activity]);

    const addActivity = (action, detail, color) =>
        setActivity(a => [newActivity(action, detail, color), ...a].slice(0, 50));

    const handleSaveTask = (task) => {
        setProjects(ps => ps.map(p => {
            if (p.id !== activeProjId) return p;
            const exists = p.tasks.find(t => t.id === task.id);
            addActivity(exists ? 'Etapa atualizada' : 'Etapa criada', task.atividade, task.respColor || 'gabriel');
            return {
                ...p,
                tasks: exists
                    ? p.tasks.map(t => t.id === task.id ? task : t)
                    : [...p.tasks, task],
            };
        }));
        setEditTask(null);
        setShowNewTask(false);
    };

    const handleDeleteTask = (taskId) => {
        const task = activeProj?.tasks.find(t => t.id === taskId);
        if (task) addActivity('Etapa removida', task.atividade, 'rose');
        setProjects(ps => ps.map(p =>
            p.id !== activeProjId ? p : { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
        ));
        setEditTask(null);
    };

    const handleSaveProject = (proj) => {
        const exists = projects.find(p => p.id === proj.id);
        if (exists) {
            setProjects(ps => ps.map(p => p.id === proj.id ? proj : p));
            addActivity('Projeto atualizado', proj.name, proj.color);
        } else {
            setProjects(ps => [...ps, proj]);
            setActiveProjId(proj.id);
            addActivity('Novo projeto criado', proj.name, proj.color);
        }
        setEditProject(null);
        setShowNewProject(false);
    };

    const handleDeleteProject = (projId) => {
        if (projects.length <= 1) return;
        const proj = projects.find(p => p.id === projId);
        addActivity('Projeto removido', proj?.name || '', 'rose');
        const remaining = projects.filter(p => p.id !== projId);
        setProjects(remaining);
        setActiveProjId(remaining[0]?.id);
    };

    const stats = useMemo(() => {
        if (!activeProj) return { total: 0, done: 0, inProg: 0, avg: 0 };
        const tasks = activeProj.tasks;
        return {
            total: tasks.length,
            done: tasks.filter(t => t.status === 'done').length,
            inProg: tasks.filter(t => t.status === 'in-progress').length,
            avg: tasks.length ? Math.round(tasks.reduce((a, t) => a + t.progress, 0) / tasks.length) : 0,
        };
    }, [activeProj]);

    const TABS = [
        { id: 'gantt', label: '📅 Cronograma' },
        { id: 'progress', label: '🔵 Progresso' },
        { id: 'analytics', label: '📊 Análise' },
        { id: 'activity', label: '⚡ Atividade' },
    ];

    return (
        <div className="app">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-inner">
                    <div className="brand">
                        <div className="brand-mark">F</div>
                        <span className="brand-name">FUIA</span>
                        <span className="brand-ver">v2.0</span>
                    </div>
                    <div className="sidebar-section">Cronogramas</div>
                    <div className="project-list">
                        {projects.map(p => {
                            const c = colorById(p.color);
                            const health = calcHealthScore(p.tasks);
                            const hColor = health >= 75 ? '#34d399' : health >= 50 ? '#fbbf24' : '#f87171';
                            return (
                                <div key={p.id}
                                    className={`proj-item ${p.id === activeProjId ? 'active' : ''}`}
                                    onClick={() => setActiveProjId(p.id)}>
                                    <span className="proj-dot" style={{ background: c.hex }} />
                                    <span className="proj-name">{p.name}</span>
                                    <span className="proj-count">{p.tasks.length}</span>
                                    <span className="proj-health" style={{ background: hColor + '22', color: hColor }}>{health}</span>
                                </div>
                            );
                        })}
                    </div>
                    <button className="add-proj-btn" onClick={() => setShowNewProject(true)}>
                        <span style={{ fontSize: '1.1rem' }}>＋</span>
                        Novo Cronograma
                    </button>
                    <div className="sidebar-bottom">
                        <button className="theme-btn" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
                            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                            {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <div className="main">
                {/* TOPBAR */}
                <div className="topbar">
                    <div className="topbar-left">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h1>{activeProj?.name || 'Selecione um projeto'}</h1>
                            {activeProj && (
                                <button className="btn btn-ghost btn-xs" style={{ marginTop: 2 }}
                                    onClick={() => setEditProject(activeProj)}>✏</button>
                            )}
                        </div>
                        <div className="sub">{activeProj?.description || ''}</div>
                    </div>
                    <div className="topbar-right">
                        {[
                            { val: stats.total, lbl: 'Etapas' },
                            { val: stats.done, lbl: 'Concluídas' },
                            { val: stats.inProg, lbl: 'Andamento' },
                            { val: `${stats.avg}%`, lbl: 'Progresso' },
                        ].map(s => (
                            <div key={s.lbl} className="stat-pill">
                                <div className="val">{s.val}</div>
                                <div className="lbl">{s.lbl}</div>
                            </div>
                        ))}
                        <button className="btn btn-primary" onClick={() => setShowNewTask(true)}>
                            ＋ Etapa
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className="tabs">
                    {TABS.map(t => (
                        <button key={t.id}
                            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
                            onClick={() => setTab(t.id)}>{t.label}</button>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="content">
                    {/* GANTT + TABLE */}
                    {tab === 'gantt' && activeProj && (
                        <div>
                            <div className="glass-card">
                                <div className="card-head">
                                    <div>
                                        <div className="card-title">Gráfico de Gantt</div>
                                        <div className="card-sub">Clique em uma barra para editar</div>
                                    </div>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setShowNewTask(true)}>＋ Nova etapa</button>
                                </div>
                                <GanttView tasks={activeProj.tasks} members={activeProj.members}
                                    onEdit={setEditTask} hoverId={hoverId} setHoverId={setHoverId} />
                            </div>
                            <div className="glass-card mt-20">
                                <div className="card-head">
                                    <div>
                                        <div className="card-title">Detalhamento</div>
                                        <div className="card-sub">{activeProj.tasks.length} etapas</div>
                                    </div>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setShowNewTask(true)}>＋ Nova etapa</button>
                                </div>
                                <TableView tasks={activeProj.tasks} onEdit={setEditTask}
                                    hoverId={hoverId} setHoverId={setHoverId} />
                            </div>
                        </div>
                    )}

                    {/* PROGRESS CARDS */}
                    {tab === 'progress' && activeProj && (
                        <div>
                            {activeProj.tasks.length === 0
                                ? <div className="empty">
                                    <div className="empty-icon">🎯</div>
                                    <div className="empty-title">Sem etapas</div>
                                    <div className="empty-sub">Adicione etapas ao projeto para ver o progresso</div>
                                </div>
                                : <div className="prog-grid">
                                    {activeProj.tasks.map(task => (
                                        <ProgCard key={task.id} task={task} onEdit={setEditTask} />
                                    ))}
                                </div>
                            }
                        </div>
                    )}

                    {/* ANALYTICS */}
                    {tab === 'analytics' && activeProj && (
                        <AnalyticsView project={activeProj} />
                    )}

                    {/* ACTIVITY */}
                    {tab === 'activity' && (
                        <div className="glass-card" style={{ maxWidth: 640 }}>
                            <div className="card-head"><div className="card-title">⚡ Log de Atividades</div></div>
                            <div className="card-body">
                                {activity.length === 0
                                    ? <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px 0' }}>Nenhuma atividade ainda</div>
                                    : activity.map(a => {
                                        const c = colorById(a.color);
                                        return (
                                            <div key={a.id} className="activity-item">
                                                <div className="activity-dot" style={{ background: c.hex }} />
                                                <div className="activity-text">
                                                    <strong style={{ color: 'var(--text-1)' }}>{a.action}</strong>
                                                    {' — '}{a.detail}
                                                </div>
                                                <div className="activity-time">{timeAgo(a.time)}</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODALS */}
            {(editTask || showNewTask) && activeProj && (
                <TaskModal
                    task={showNewTask ? null : editTask}
                    members={activeProj.members}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    onClose={() => { setEditTask(null); setShowNewTask(false); }}
                />
            )}
            {(editProject || showNewProject) && (
                <ProjectModal
                    project={showNewProject ? null : editProject}
                    onSave={handleSaveProject}
                    onClose={() => { setEditProject(null); setShowNewProject(false); }}
                />
            )}
            {editProject && (
                <div style={{ position: 'fixed', bottom: 20, left: 280, zIndex: 300 }}>
                    <button className="btn btn-danger btn-sm"
                        onClick={() => { if (confirm('Excluir este projeto?')) handleDeleteProject(editProject.id); }}>
                        🗑 Excluir Projeto
                    </button>
                </div>
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
