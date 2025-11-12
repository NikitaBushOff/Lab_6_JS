import { createComponent } from '../utils/component.js';
import { fetchData, LocalStorage, debounce } from '../utils/api.js';
import { Router } from '../utils/router.js';

export async function UsersPage() {
    const router = new Router();
    
    const container = createComponent('div', { className: 'container' },
        [
            createComponent('h1', { className: 'page-title' }, 'Пользователи'),
            createComponent('div', { id: 'users-content' })
        ]
    );
    
    await renderUsers(container.querySelector('#users-content'));
    setupSearch(container);
    
    return container;
}

async function renderUsers(container) {
    container.innerHTML = '<div class="loading">Загрузка пользователей...</div>';
    
    try {
        // Получаем пользователей из API
        const apiUsers = await fetchData('users');
        // Получаем локальных пользователей
        const localUsers = LocalStorage.get('users') || [];
        
        const allUsers = [...apiUsers, ...localUsers];
        
        if (allUsers.length === 0) {
            container.innerHTML = '<div class="empty-state">Пользователи не найдены</div>';
            return;
        }
        
        const usersGrid = createComponent('div', { className: 'cards-container' });
        
        allUsers.forEach(user => {
            const userCard = createUserCard(user);
            usersGrid.appendChild(userCard);
        });
        
        container.innerHTML = '';
        container.appendChild(usersGrid);
        
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Ошибка при загрузке пользователей</div>';
    }
}

function createUserCard(user) {
    const isLocal = user.id > 10; // Предполагаем, что локальные пользователи имеют ID > 10
    
    const card = createComponent('div', { className: 'card' },
        [
            createComponent('h3', {}, user.name),
            createComponent('p', {}, `Email: ${user.email}`),
            createComponent('p', {}, `Телефон: ${user.phone}`),
            createComponent('p', {}, `Сайт: ${user.website}`),
            createComponent('div', { className: 'card-actions' },
                [
                    createComponent('button', {
                        className: 'btn',
                        onclick: () => showUserTodos(user.id)
                    }, 'Задачи'),
                    createComponent('button', {
                        className: 'btn',
                        onclick: () => showUserPosts(user.id)
                    }, 'Посты'),
                    isLocal ? createComponent('button', {
                        className: 'btn btn-danger',
                        onclick: () => deleteUser(user.id)
                    }, 'Удалить') : null
                ].filter(Boolean)
            )
        ]
    );
    
    return card;
}

function showUserTodos(userId) {
    const router = new Router();
    router.navigate('users#todos');
    // В реальном приложении здесь бы передавался userId
}

function showUserPosts(userId) {
    const router = new Router();
    router.navigate('users#posts');
    // В реальном приложении здесь бы передавался userId
}

function deleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        const localUsers = LocalStorage.get('users') || [];
        const updatedUsers = localUsers.filter(user => user.id !== userId);
        LocalStorage.set('users', updatedUsers);
        
        // Перезагружаем страницу
        location.reload();
    }
}

function setupSearch(container) {
    const searchInput = document.getElementById('global-search');
    
    const handleSearch = debounce(async (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const usersContent = container.querySelector('#users-content');
        
        try {
            const apiUsers = await fetchData('users');
            const localUsers = LocalStorage.get('users') || [];
            const allUsers = [...apiUsers, ...localUsers];
            
            const filteredUsers = searchTerm ? 
                allUsers.filter(user => 
                    user.name.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm)
                ) : 
                allUsers;
            
            const usersGrid = createComponent('div', { className: 'cards-container' });
            
            filteredUsers.forEach(user => {
                const userCard = createUserCard(user);
                usersGrid.appendChild(userCard);
            });
            
            usersContent.innerHTML = '';
            usersContent.appendChild(usersGrid);
            
        } catch (error) {
            console.error('Error searching users:', error);
        }
    }, 300);
    
    searchInput.addEventListener('input', handleSearch);
}