       // Variável para armazenar o livro atual
       let currentBook = '';
        
       // Função para abrir o modal de capítulos
       function openChaptersModal(bookTitle) {
           currentBook = bookTitle;
           document.getElementById('modalBookTitle').textContent = `${bookTitle} - Capítulos`;
           
           // Limpa a lista de capítulos
           const chaptersList = document.getElementById('chaptersList');
           chaptersList.innerHTML = '';
           
           // Adiciona capítulos de exemplo (substitua por seus dados reais)
           for (let i = 1; i <= 10; i++) {
               const chapterItem = document.createElement('div');
               chapterItem.className = 'chapter-item';
               chapterItem.innerHTML = `
                   <div class="chapter-info">
                       <span class="chapter-number">${i}</span>
                       <span class="chapter-title">Capítulo ${i}: Título do Capítulo</span>
                   </div>
                   <button class="edit-chapter-btn" onclick="openEditChapterModal(${i}, 'Título do Capítulo')">Editar</button>
               `;
               chaptersList.appendChild(chapterItem);
           }
           
           document.getElementById('chaptersModal').style.display = 'flex';
       }
       
       // Função para abrir o modal de edição de capítulo
       function openEditChapterModal(chapterNumber, chapterTitle) {
           document.getElementById('chapterEditInfo').textContent = 
               `Capítulo ${chapterNumber} - ${currentBook}`;
           document.getElementById('chapterTitle').value = chapterTitle;
           document.getElementById('chapterDate').value = new Date().toISOString().split('T')[0];
           document.getElementById('chapterContent').value = 
               `Conteúdo do capítulo ${chapterNumber} do livro ${currentBook}...`;
           
           document.getElementById('chapterEditModal').style.display = 'flex';
       }
       
       // Função para fechar o modal de capítulos
       function closeModal() {
           document.getElementById('chaptersModal').style.display = 'none';
       }
       
       // Função para fechar o modal de edição
       function closeEditModal() {
           document.getElementById('chapterEditModal').style.display = 'none';
       }
       
       // Fecha os modais ao clicar fora do conteúdo
       window.addEventListener('click', function(event) {
           const chaptersModal = document.getElementById('chaptersModal');
           if (event.target === chaptersModal) {
               closeModal();
           }
           
           const editModal = document.getElementById('chapterEditModal');
           if (event.target === editModal) {
               closeEditModal();
           }
       });
       
       // Adiciona evento ao botão "Adicionar capítulo"
       document.querySelector('.add-chapter-btn').addEventListener('click', function() {
           const chaptersList = document.getElementById('chaptersList');
           const chapterCount = chaptersList.children.length + 1;
           openEditChapterModal(chapterCount, `Novo Capítulo ${chapterCount}`);
       });
       
       // Adiciona evento ao botão "Salvar" no modal de edição
       document.querySelector('.btn-save').addEventListener('click', function() {
           alert('Capítulo salvo com sucesso!');
           closeEditModal();
       });