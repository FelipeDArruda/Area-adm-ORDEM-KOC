// Alternar entre abas
function switchTab(tabId) {
    // Esconde todos os conteúdos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove a classe active de todas as abas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostra o conteúdo selecionado
    document.getElementById(tabId).classList.add('active');
    
    // Ativa a aba selecionada
    event.currentTarget.classList.add('active');
}

// Função para deletar usuários
document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            row.style.opacity = '0.5';
            setTimeout(() => {
                row.remove();
                updateStats();
            }, 300);
        }
    });
});

// Função para filtrar tabela
document.querySelector('.search-input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('.users-table tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td:first-child').textContent.toLowerCase();
        const email = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || email.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Função para filtrar por status
document.querySelectorAll('.filter-select')[0].addEventListener('change', function() {
    const statusFilter = this.value;
    const rows = document.querySelectorAll('.users-table tbody tr');
    
    rows.forEach(row => {
        const status = row.querySelector('td:nth-child(3) span').textContent;
        
        if (statusFilter === 'Todos os status' || status === statusFilter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Função para ordenar tabela
document.querySelectorAll('.filter-select')[1].addEventListener('change', function() {
    const sortBy = this.value;
    const tbody = document.querySelector('.users-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = getSortValue(a, sortBy);
        const bValue = getSortValue(b, sortBy);
        
        if (sortBy.includes('data')) {
            return compareDates(aValue, bValue);
        }
        return aValue.localeCompare(bValue);
    });
    
    // Reinsere as linhas ordenadas
    rows.forEach(row => tbody.appendChild(row));
});

function getSortValue(row, sortBy) {
    if (sortBy.includes('nome')) {
        return row.querySelector('td:first-child').textContent;
    } else if (sortBy.includes('plano')) {
        return row.querySelector('td:nth-child(3) span').textContent;
    } else {
        // Ordenar por data (padrão)
        return row.querySelector('td:nth-child(4)').textContent;
    }
}

function compareDates(a, b) {
    // Converte datas no formato DD/MM para objeto Date
    const [dayA, monthA] = a.split('/').map(Number);
    const [dayB, monthB] = b.split('/').map(Number);
    
    // Considera o ano atual para comparação
    const dateA = new Date(new Date().getFullYear(), monthA - 1, dayA);
    const dateB = new Date(new Date().getFullYear(), monthB - 1, dayB);
    
    return dateB - dateA; // Mais recente primeiro
}

// Atualiza estatísticas após exclusão
function updateStats() {
    const totalSubscribers = document.querySelectorAll('.users-table tbody tr').length;
    document.querySelector('.subscription-stats .stat-card:nth-child(3) .stat-value').textContent = totalSubscribers;
}

// Simular integração com API do apoia.se
function fetchApoiaseData() {
    // Em um sistema real, isso seria uma chamada API
    console.log("Conectando com apoia.se para obter dados...");
    
    // Simular delay de carregamento
    setTimeout(() => {
        // Atualizar valores dinamicamente
        const supportersElement = document.querySelector('.dashboard .card:nth-child(2) .card-value');
        const newSupporters = Math.floor(Math.random() * 10) + 1;
        const currentSupporters = parseInt(supportersElement.textContent.replace('.', ''));
        supportersElement.textContent = (currentSupporters + newSupporters).toLocaleString('pt-BR');
        
        // Adicionar novo apoiador à lista
        const names = ['Carlos', 'Fernanda', 'Ricardo', 'Beatriz', 'Lucas'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const isKOCReader = Math.random() > 0.3; // 70% de chance de ser leitor KOC
        
        const supportersList = document.querySelector('.supporters-list');
        const newSupporter = document.createElement('div');
        newSupporter.className = 'supporter-item';
        newSupporter.innerHTML = `
            <div class="supporter-avatar">${randomName.substring(0, 1)}</div>
            <div class="supporter-info">
                <h4 class="supporter-name">${randomName} ${randomName.substring(0, 1)}.</h4>
                <p class="supporter-details">Apoiador desde ${new Date().toLocaleDateString('pt-BR')} ${isKOCReader ? '• Leitor KOC' : ''}</p>
            </div>
            <div class="supporter-amount">R$ ${Math.floor(Math.random() * 30) + 10}/mês</div>
        `;
        
        supportersList.insertBefore(newSupporter, supportersList.children[1]);
        
        // Atualizar contador de leitores KOC se for o caso
        if (isKOCReader) {
            const kocReadersElement = document.querySelector('#analytics .card:nth-child(1) .card-value');
            const currentReaders = parseInt(kocReadersElement.textContent);
            kocReadersElement.textContent = currentReaders + 1;
        }
    }, 1500);
}

// Simular atualização periódica de dados
setInterval(fetchApoiaseData, 10000);

// Conectar com apoia.se
document.querySelector('.connect-btn').addEventListener('click', function() {
    alert("Integração com apoia.se será realizada aqui");
    fetchApoiaseData();
});
