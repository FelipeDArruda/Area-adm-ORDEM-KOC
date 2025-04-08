// Funções para controlar o modal
function openEditModal(title, author, description, chapters) {
    document.getElementById('bookTitle').value = title;
    document.getElementById('bookAuthor').value = author;
    document.getElementById('bookDescription').value = description;
    
    // Atualiza a pré-visualização
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewAuthor').textContent = author;
    document.getElementById('previewDescription').textContent = description;
    document.getElementById('previewChapters').textContent = chapters + ' Capítulos';
    
    document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Adiciona evento ao botão "Adicionar Livro"
document.getElementById('addBookBtn').addEventListener('click', function() {
    openEditModal('', '', '', '0');
});

// Atualiza a pré-visualização quando os campos são editados
document.getElementById('bookTitle').addEventListener('input', function() {
    document.getElementById('previewTitle').textContent = this.value || 'Título do Livro';
});

document.getElementById('bookAuthor').addEventListener('input', function() {
    document.getElementById('previewAuthor').textContent = this.value || 'Autor';
});

document.getElementById('bookDescription').addEventListener('input', function() {
    document.getElementById('previewDescription').textContent = this.value || 'Descrição do livro';
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
});
