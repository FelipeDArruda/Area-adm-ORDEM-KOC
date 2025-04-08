    // Simula atualização de status em tempo real
    function updateSecurityStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.security-status span');
        
        // Simula uma verificação de status (em um sistema real, seria uma chamada API)
        const isSecure = Math.random() > 0.1; // 90% de chance de estar seguro
        
        if (isSecure) {
            statusIndicator.style.backgroundColor = var(--success-color);
            statusText.textContent = 'Sistema seguro';
        } else {
            statusIndicator.style.backgroundColor = var(--danger-color);
            statusText.textContent = 'Atenção: risco detectado';
        }
    }
    
    // Atualiza a cada 30 segundos
    setInterval(updateSecurityStatus, 30000);
    
    // Atualiza os logs dinamicamente (simulação)
    function addNewLog() {
        const logTable = document.querySelector('.log-table tbody');
        const now = new Date();
        const timeString = now.toISOString().replace('T', ' ').substring(0, 16);
        const actions = ['Login bem-sucedido', 'Tentativa de login falha', 'Alteração de conteúdo', 'Alteração de configurações'];
        const statuses = ['status-success', 'status-danger', 'status-warning'];
        const statusTexts = ['Sucesso', 'Bloqueado', 'Aviso'];
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomStatus = Math.floor(Math.random() * 3);
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${timeString}</td>
            <td>${Math.random() > 0.5 ? 'admin' : 'editor'}</td>
            <td class="log-ip">${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}</td>
            <td>${randomAction}</td>
            <td><span class="log-status ${statuses[randomStatus]}">${statusTexts[randomStatus]}</span></td>
        `;
        
        logTable.insertBefore(newRow, logTable.firstChild);
        
        // Mantém apenas os 10 logs mais recentes
        if (logTable.children.length > 10) {
            logTable.removeChild(logTable.lastChild);
        }
    }
    
    // Adiciona um novo log a cada 1-3 minutos
    setInterval(addNewLog, Math.random() * 120000 + 60000);