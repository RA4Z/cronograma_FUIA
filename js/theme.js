// =====================================================
// THEME.JS — Alternância de Tema
// =====================================================

function initTheme() {
    const html        = document.documentElement;
    const toggleBtn   = document.getElementById('themeToggle');
    const themeLabel  = toggleBtn.querySelector('.theme-label');

    const saved = localStorage.getItem('fuia-theme') || 'light';
    html.setAttribute('data-theme', saved);
    updateLabel(saved);

    toggleBtn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next    = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('fuia-theme', next);
        updateLabel(next);
    });

    function updateLabel(theme) {
        themeLabel.textContent = theme === 'light' ? 'Tema Escuro' : 'Tema Claro';
    }
}
