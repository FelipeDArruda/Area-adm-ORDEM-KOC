// Alternar entre abas de configurações
function switchSettingsTab(tab) {
    // Esconde todos os conteúdos
    document.querySelectorAll('.settings-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove a classe active de todas as abas
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostra o conteúdo selecionado
    document.getElementById(`${tab}-settings`).classList.add('active');
    
    // Ativa a aba selecionada
    event.currentTarget.classList.add('active');
}

// Enviar e-mail de teste
document.querySelector('.btn-test').addEventListener('click', function() {
    const email = document.querySelector('.email-test-input').value;
    if (email && email.includes('@')) {
        alert(`E-mail de teste enviado para ${email}`);
    } else {
        alert('Por favor, insira um endereço de e-mail válido');
    }
});

// Confirmar ações perigosas
document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja realizar esta ação? Esta operação não pode ser desfeita.')) {
            alert('Ação realizada com sucesso!');
        }
    });
});

// Auto-resize do textarea
document.querySelectorAll('.input-textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});
