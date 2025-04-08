document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // CONFIGURAÇÕES E CONSTANTES
    // =============================================
    const CONFIG = {
        repoName: 'Area-adm-ORDEM-KOC',
        pageScripts: {
            'dashboard': 'dash.js',
            'catalog': 'catalog.js',
            'capitulos': 'chapters.js',
            'comentarios': 'comments.js',
            'security': 'security.js',
            'platforms': 'platforms.js',
            'cards': 'cards.js',
            'chat': 'chat.js',
            'configuracoes': 'settings.js',
            'login': 'login.js',
            'adm': 'adm.js'
        }
    };

    // =============================================
    // FUNÇÕES PRINCIPAIS
    // =============================================

    /**
     * Carrega o conteúdo de uma página dinamicamente
     * @param {string} page - Nome da página a ser carregada
     */
    async function loadContent(page) {
        try {
            console.log(`Carregando página: ${page}`);
            
            const paths = getPagePaths(page);
            const response = await tryFetchPaths(paths);
            
            if (!response.ok) {
                throw new Error(`Página ${page} não encontrada`);
            }
            
            let content = await response.text();
            content = fixImagePaths(content, isGitHubPages());
            
            document.getElementById('main-content').innerHTML = content;
            updateActiveMenu(page);
            loadPageScripts(page);
            
            // Inicializa dashboard se necessário
            if (page === 'dashboard') {
                initDashboardCharts();
            }
            
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            showErrorMessage(page);
        }
    }

    // =============================================
    // FUNÇÕES AUXILIARES
    // =============================================

    /**
     * Corrige caminhos de imagens no conteúdo HTML
     */
    function fixImagePaths(htmlContent, isGitHubPages = false) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const basePath = isGitHubPages ? `/${CONFIG.repoName}/` : '../';
        
        tempDiv.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            
            if (src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) {
                return;
            }
            
            if (src.startsWith('img/')) {
                img.src = `${basePath}${src}`;
            } else if (src.startsWith('pages/')) {
                img.src = `${basePath}${src}`;
            } else if (!src.includes('/')) {
                img.src = `${basePath}img/${src}`;
            }
        });
        
        return tempDiv.innerHTML;
    }

    /**
     * Carrega scripts específicos de cada página
     */
    function loadPageScripts(page) {
        if (!CONFIG.pageScripts[page]) return;
        
        const script = document.createElement('script');
        script.src = `js/${CONFIG.pageScripts[page]}`;
        script.onerror = () => console.error(`Falha ao carregar script: ${CONFIG.pageScripts[page]}`);
        document.body.appendChild(script);
    }

    /**
     * Atualiza o item ativo no menu lateral
     */
    function updateActiveMenu(page) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`.menu-item[data-page="${page}"]`);
        if (activeItem) activeItem.classList.add('active');
    }

    // =============================================
    // FUNÇÕES DE UTILIDADE
    // =============================================

    function isGitHubPages() {
        return window.location.host.includes('github.io');
    }

    function getPagePaths(page) {
        const isGH = isGitHubPages();
        const base = isGH ? `/${CONFIG.repoName}` : '';
        
        return [
            `${base}/pages/${page}.html`,  // GitHub Pages
            `pages/${page}.html`,          // Local fallback
            `/${page}.html`                // Absolute path
        ];
    }

    async function tryFetchPaths(paths) {
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) return response;
            } catch (e) {
                console.warn(`Falha no path: ${path}`, e);
            }
        }
        return { ok: false };
    }

    function initDashboardCharts() {
        if (typeof Chart === 'undefined') {
            loadScript('https://cdn.jsdelivr.net/npm/chart.js', () => {
                if (typeof initializeDashboard === 'function') {
                    initializeDashboard();
                }
            });
        } else if (typeof initializeDashboard === 'function') {
            initializeDashboard();
        }
    }

    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = () => console.error(`Falha ao carregar script: ${src}`);
        document.body.appendChild(script);
    }

    function showErrorMessage(page) {
        document.getElementById('main-content').innerHTML = `
            <div class="error-message">
                <h2>Erro ao carregar o conteúdo</h2>
                <p>A página ${page} não pôde ser carregada.</p>
                <button onclick="loadContent('${page}')">Tentar novamente</button>
            </div>
        `;
    }

    // =============================================
    // EVENT LISTENERS
    // =============================================

    function setupEventListeners() {
        // Menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                loadContent(page);
                history.pushState(null, null, `#${page}`);
            });
        });

        // Menu toggle
        document.getElementById('menu-toggle').addEventListener('click', function() {
            document.querySelector('.menu-lateral').classList.toggle('menu-collapsed');
        });

        // Navigation
        window.addEventListener('popstate', function() {
            const hash = window.location.hash.substring(1);
            if (hash) loadContent(hash);
        });
    }

    // =============================================
    // INICIALIZAÇÃO
    // =============================================

    function initialize() {
        setupEventListeners();
        
        const hash = window.location.hash.substring(1);
        const initialPage = hash || 'dashboard';
        loadContent(initialPage);
    }

    // Inicia a aplicação
    initialize();
});