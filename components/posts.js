import { createComponent } from '../utils/component.js';
import { fetchData, debounce } from '../utils/api.js';
import { Router } from '../utils/router.js';

export async function PostsPage() {
    const router = new Router();
    
    const container = createComponent('div', { className: 'container' },
        [
            createComponent('h1', { className: 'page-title' }, 'Посты'),
            createComponent('div', { id: 'posts-content' })
        ]
    );
    
    await renderPosts(container.querySelector('#posts-content'));
    setupSearch(container);
    
    return container;
}

async function renderPosts(container) {
    container.innerHTML = '<div class="loading">Загрузка постов...</div>';
    
    try {
        const posts = await fetchData('posts');
        
        if (posts.length === 0) {
            container.innerHTML = '<div class="empty-state">Посты не найдены</div>';
            return;
        }
        
        const postsGrid = createComponent('div', { className: 'cards-container' });
        
        posts.forEach(post => {
            const postCard = createPostCard(post);
            postsGrid.appendChild(postCard);
        });
        
        container.innerHTML = '';
        container.appendChild(postsGrid);
        
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Ошибка при загрузке постов</div>';
    }
}

function createPostCard(post) {
    const card = createComponent('div', { className: 'card' },
        [
            createComponent('h3', {}, post.title),
            createComponent('p', {}, post.body),
            createComponent('p', {}, `Пользователь ID: ${post.userId}`),
            createComponent('button', {
                className: 'btn',
                onclick: () => showPostComments(post.id)
            }, 'Комментарии')
        ]
    );
    
    return card;
}

function showPostComments(postId) {
    const router = new Router();
    router.navigate('users#posts#comments');
    // В реальном приложении здесь бы передавался postId
}

function setupSearch(container) {
    const searchInput = document.getElementById('global-search');
    
    const handleSearch = debounce(async (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const postsContent = container.querySelector('#posts-content');
        
        try {
            const posts = await fetchData('posts');
            
            const filteredPosts = searchTerm ? 
                posts.filter(post => 
                    post.title.toLowerCase().includes(searchTerm) ||
                    post.body.toLowerCase().includes(searchTerm)
                ) : 
                posts;
            
            const postsGrid = createComponent('div', { className: 'cards-container' });
            
            filteredPosts.forEach(post => {
                const postCard = createPostCard(post);
                postsGrid.appendChild(postCard);
            });
            
            postsContent.innerHTML = '';
            postsContent.appendChild(postsGrid);
            
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    }, 300);
    
    searchInput.addEventListener('input', handleSearch);
}