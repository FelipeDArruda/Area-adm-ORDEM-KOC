// Alternar entre plataformas de chat
function switchPlatform(platform) {
    document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Em um sistema real, aqui seria a integração com a plataforma escolhida
    console.log(`Mudando para ${platform}`);
}

// Alternar entre conversas
function switchChat(user) {
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    // Adiciona mensagens fictícias baseadas no usuário selecionado
    if (user === 'group') {
        chatMessages.innerHTML = `
            <div class="message received">
                <div class="message-header">
                    <div class="message-avatar avatar-author">G</div>
                    <span class="message-sender">Glauber</span>
                    <span class="message-time">10:30</span>
                </div>
                <div class="message-content">
                    Pessoal, como está o progresso do capítulo 12? Preciso enviar para revisão até sexta.
                </div>
            </div>
            
            <div class="message received">
                <div class="message-header">
                    <div class="message-avatar avatar-reviewer">A</div>
                    <span class="message-sender">Ali</span>
                    <span class="message-time">10:32</span>
                </div>
                <div class="message-content">
                    Estou terminando a revisão do capítulo 11 hoje. Amanhã começo o 12.
                </div>
            </div>
            
            <div class="message received">
                <div class="message-header">
                    <div class="message-avatar avatar-dev">A</div>
                    <span class="message-sender">Arruda</span>
                    <span class="message-time">10:35</span>
                </div>
                <div class="message-content">
                    A página de comentários está quase pronta. Só falta integrar com o back-end.
                </div>
            </div>
            
            <div class="message received">
                <div class="message-header">
                    <div class="message-avatar avatar-dev">S</div>
                    <span class="message-sender">Sancho</span>
                    <span class="message-time">10:36</span>
                </div>
                <div class="message-content">
                    Arruda, me avisa quando terminar que eu ajudo com os testes.
                </div>
            </div>
            
            <div class="message received">
                <div class="message-header">
                    <div class="message-avatar avatar-unknown">L</div>
                    <span class="message-sender">Leandro</span>
                    <span class="message-time">10:40</span>
                </div>
                <div class="message-content">
                    Galera, vocês sabem quando sai o próximo capítulo? Sou fã do trabalho de vocês!
                </div>
            </div>
            
            <div class="message sent">
                <div class="message-header">
                    <span class="message-time">10:42</span>
                </div>
                <div class="message-content">
                    Leandro, este chat é apenas para a equipe. Por favor, use o chat público para dúvidas.
                </div>
            </div>
        `;
    } else if (user === 'glauber') {
        chatMessages.innerHTML = `
            <div class="message received">
                <div class="message-header">
                    <div class="message-avatar avatar-author">G</div>
                    <span class="message-sender">Glauber</span>
                    <span class="message-time">09:15</span>
                </div>
                <div class="message-content">
                    Você já viu as últimas alterações que fiz no capítulo?
                </div>
            </div>
            
            <div class="message sent">
                <div class="message-header">
                    <span class="message-time">09:20</span>
                </div>
                <div class="message-content">
                    Ainda não, vou dar uma olhada agora.
                </div>
            </div>
        `;
    } else if (user === 'arruda') {
        chatMessages.innerHTML = `
            <div class="message received">
                <div class="message-header">
                    <div class="message-avatar avatar-dev">A</div>
                    <span class="message-sender">Arruda</span>
                    <span class="message-time">14:05</span>
                </div>
                <div class="message-content">
                    Terminei a integração com a API de pagamentos. Precisa testar no seu ambiente.
                </div>
            </div>
            
            <div class="message sent">
                <div class="message-header">
                    <span class="message-time">14:10</span>
                </div>
                <div class="message-content">
                    Ótimo! Vou testar ainda hoje e te dou o feedback.
                </div>
            </div>
        `;
    }
    
    // Rolagem automática para a mensagem mais recente
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enviar mensagem
document.querySelector('.send-btn').addEventListener('click', function() {
    const input = document.querySelector('.message-input');
    const message = input.value.trim();
    
    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        const now = new Date();
        const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        
        const newMessage = document.createElement('div');
        newMessage.className = 'message sent';
        newMessage.innerHTML = `
            <div class="message-header">
                <span class="message-time">${timeString}</span>
            </div>
            <div class="message-content">
                ${message}
            </div>
        `;
        
        chatMessages.appendChild(newMessage);
        input.value = '';
        
        // Rolagem automática para a mensagem mais recente
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simular resposta após 1-3 segundos
        setTimeout(simulateReply, Math.random() * 2000 + 1000);
    }
});

// Tecla Enter para enviar mensagem
document.querySelector('.message-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.querySelector('.send-btn').click();
    }
});

// Auto-resize do textarea
document.querySelector('.message-input').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Simular resposta de outros membros
function simulateReply() {
    const activeUser = document.querySelector('.user-item.active');
    if (!activeUser) return;
    
    const userId = activeUser.getAttribute('onclick').replace("switchChat('", "").replace("')", "");
    if (userId === 'group') return; // Não simular respostas no grupo
    
    const chatMessages = document.getElementById('chatMessages');
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
    const replies = {
        glauber: [
            "Precisamos conversar sobre o desenvolvimento dos personagens no próximo arco.",
            "Você já leu o rascunho que enviei?",
            "Estou pensando em mudar o final do capítulo 15."
        ],
        arruda: [
            "Encontrei um bug na página de perfil do usuário.",
            "Atualizei o repositório com as últimas alterações.",
            "Preciso que você revise o PR #42 quando puder."
        ],
        ali: [
            "Enviei as anotações de revisão para o capítulo 10.",
            "Tem uma inconsistência na linha do tempo do capítulo 8.",
            "A revisão ficará pronta até amanhã."
        ],
        sancho: [
            "Terminei os testes da nova funcionalidade.",
            "Arruda, você pode me ajudar com um problema no Docker?",
            "Atualizei a documentação da API."
        ],
        leandro: [
            "Desculpe a intromissão novamente!",
            "Como faço para participar da equipe?",
            "Adoro o trabalho de vocês!"
        ]
    };
    
    const randomReply = replies[userId][Math.floor(Math.random() * replies[userId].length)];
    
    const newMessage = document.createElement('div');
    newMessage.className = 'message received';
    
    let avatarClass = '';
    let senderName = '';
    
    switch(userId) {
        case 'glauber':
            avatarClass = 'avatar-author';
            senderName = 'Glauber';
            break;
        case 'arruda':
        case 'sancho':
            avatarClass = 'avatar-dev';
            senderName = userId === 'arruda' ? 'Arruda' : 'Sancho';
            break;
        case 'ali':
            avatarClass = 'avatar-reviewer';
            senderName = 'Ali';
            break;
        case 'leandro':
            avatarClass = 'avatar-unknown';
            senderName = 'Leandro';
            break;
    }
    
    newMessage.innerHTML = `
        <div class="message-header">
            <div class="message-avatar ${avatarClass}">${senderName.substring(0, 1)}</div>
            <span class="message-sender">${senderName}</span>
            <span class="message-time">${timeString}</span>
        </div>
        <div class="message-content">
            ${randomReply}
        </div>
    `;
    
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
