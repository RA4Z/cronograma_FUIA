// ─── COMPONENT: ColorPicker ───────────────────────────────────────────────────

function ColorPicker({ value, onChange }) {
    return (
        <div className="color-grid">
            {COLORS.map(c => (
                <div key={c.id}
                    className={`color-swatch ${value === c.id ? 'selected' : ''}`}
                    style={{ background: c.hex }}
                    title={c.label}
                    onClick={() => onChange(c.id)} />
            ))}
        </div>
    );
}

// ─── COMPONENT: MembersInput ──────────────────────────────────────────────────

function MembersInput({ members, onChange, pool }) {
    const [inputVal, setInputVal] = React.useState('');
    const [showSug, setShowSug] = React.useState(false);
    const wrapRef = React.useRef();

    const suggestions = (pool || MEMBER_POOL).filter(m =>
        m.name.toLowerCase().includes(inputVal.toLowerCase()) &&
        !members.find(x => x.name === m.name) &&
        inputVal
    );

    const addMember = (m) => {
        onChange([...members, m]);
        setInputVal('');
        setShowSug(false);
    };
    const removeMember = (name) => onChange(members.filter(m => m.name !== name));

    const handleKey = (e) => {
        if (e.key === 'Enter' && inputVal.trim()) {
            const existing = (pool || MEMBER_POOL).find(m => m.name.toLowerCase() === inputVal.toLowerCase());
            addMember(existing || { name: inputVal.trim(), color: 'gabriel' });
        }
        if (e.key === 'Backspace' && !inputVal && members.length) {
            removeMember(members[members.length - 1].name);
        }
    };

    React.useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSug(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <div className="members-list" onClick={() => document.getElementById('minput').focus()}>
                {members.map(m => (
                    <span key={m.name} className="member-tag">
                        <span className="member-tag-dot" style={{ background: colorById(m.color).hex }} />
                        {m.name}
                        <button onClick={e => { e.stopPropagation(); removeMember(m.name); }}>✕</button>
                    </span>
                ))}
                <input
                    id="minput"
                    className="member-input"
                    placeholder="Adicionar membro..."
                    value={inputVal}
                    onChange={e => { setInputVal(e.target.value); setShowSug(true); }}
                    onFocus={() => setShowSug(true)}
                    onKeyDown={handleKey}
                />
            </div>
            {showSug && suggestions.length > 0 && (
                <div className="member-suggestions">
                    {suggestions.map(m => (
                        <div key={m.name} className="msug-item" onMouseDown={() => addMember(m)}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: colorById(m.color).hex, flexShrink: 0, display: 'inline-block' }} />
                            {m.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
