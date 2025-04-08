document.addEventListener('DOMContentLoaded', function() {
    // Função auxiliar para corrigir caminhos de imagens
    function fixImagePaths(htmlContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        const images = tempDiv.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            
            if (src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) {
                return;
            }
            
            if (src.startsWith('img/')) {
                img.src = `../${src}`;
            } else if (src.startsWith('pages/')) {
                img.src = `../${src}`;
            } else if (!src.includes('/')) {
                // Se for apenas nome do arquivo, assume que está em img/
                img.src = `../img/${src}`;
            }
        });
        
        return tempDiv.innerHTML;
    }

    // Carrega o conteúdo da página
    async function loadContent(page) {
        try {
            console.log(`Carregando página: ${page}`);
            
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Falha ao carregar página');
            
            let content = await response.text();
            content = fixImagePaths(content);
            
            document.getElementById('main-content').innerHTML = content;
            updateActiveMenu(page);
            loadPageScripts(page);
            
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            showErrorMessage();
        }
    }

    // Atualiza o item ativo no menu
    function updateActiveMenu(page) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`.menu-item[data-page="${page}"]`);
        if (activeItem) activeItem.classList.add('active');
    }

    // Carrega scripts específicos de cada página
    function loadPageScripts(page) {
        const pageScriptMap = {
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
            'adm': 'adm.js' // Adicionei adm.js caso precise
        };

        if (pageScriptMap[page]) {
            const script = document.createElement('script');
            script.src = `js/${pageScriptMap[page]}`;
            script.onerror = () => console.error(`Falha ao carregar script: ${pageScriptMap[page]}`);
            document.body.appendChild(script);
        }
    }

    // Função para carregar scripts dinamicamente
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = () => console.error(`Falha ao carregar script: ${src}`);
        document.body.appendChild(script);
    }

    // Mostra mensagem de erro
    function showErrorMessage() {
        document.getElementById('main-content').innerHTML = `
            <div class="error-message">
                <h2>Erro ao carregar o conteúdo</h2>
                <p>A página solicitada não pôde ser carregada.</p>
                <button onclick="location.reload()">Tentar novamente</button>
            </div>
        `;
    }

    // Configura os cliques do menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadContent(page);
            history.pushState(null, null, `#${page}`);
        });
    });

    // Configura o toggle do menu
    document.getElementById('menu-toggle').addEventListener('click', function() {
        document.querySelector('.menu-lateral').classList.toggle('menu-collapsed');
    });

    // Verifica a hash da URL ao carregar
    function checkInitialPage() {
        const hash = window.location.hash.substring(1);
        const initialPage = hash || 'dashboard';
        loadContent(initialPage);
    }

    // Manipula o botão voltar/avançar
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        if (hash) loadContent(hash);
    });

    // Inicializa a página
    checkInitialPage();
});

