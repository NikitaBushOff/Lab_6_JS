import { createComponent } from '../utils/component.js';
import { fetchData, debounce } from '../utils/api.js';

export async function CommentsPage() {
    const container = createComponent('div', { className: 'container' },
        [
            createComponent('h1', { className: 'page-title' }, 'Комментарии'),
            createComponent('div', { id: 'comments-content' })
        ]
    );
    
    await renderComments(container.querySelector('#comments-content'));
    setupSearch(container);
    
    return container;
}

async function renderComments(container) {
    container.innerHTML = '<div class="loading">Загрузка комментариев...</div>';
    
    try {
        const comments = await fetchData('comments');
        
        if (comments.length === 0) {
            container.innerHTML = '<div class="empty-state">Комментарии не найдены</div>';
            return;
        }
        
        const commentsList = createComponent('div', { className: 'cards-container' });
        
        comments.forEach(comment => {
            const commentCard = createCommentCard(comment);
            commentsList.appendChild(commentCard);
        });
        
        container.innerHTML = '';
        container.appendChild(commentsList);
        
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Ошибка при загрузке комментариев</div>';
    }
}

function createCommentCard(comment) {
    const card = createComponent('div', { className: 'card' },
        [
            createComponent('h3', {}, comment.name),
            createComponent('p', {}, comment.body),
            createComponent('p', {}, `Email: ${comment.email}`),
            createComponent('p', {}, `Пост ID: ${comment.postId}`)
        ]
    );
    
    return card;
}

function setupSearch(container) {
    const searchInput = document.getElementById('global-search');
    
    const handleSearch = debounce(async (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const commentsContent = container.querySelector('#comments-content');
        
        try {
            const comments = await fetchData('comments');
            
            const filteredComments = searchTerm ? 
                comments.filter(comment => 
                    comment.name.toLowerCase().includes(searchTerm) ||
                    comment.body.toLowerCase().includes(searchTerm)
                ) : 
                comments;
            
            const commentsList = createComponent('div', { className: 'cards-container' });
            
            filteredComments.forEach(comment => {
                const commentCard = createCommentCard(comment);
                commentsList.appendChild(commentCard);
            });
            
            commentsContent.innerHTML = '';
            commentsContent.appendChild(commentsList);
            
        } catch (error) {
            console.error('Error searching comments:', error);
        }
    }, 300);
    
    searchInput.addEventListener('input', handleSearch);
}