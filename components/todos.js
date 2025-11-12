import { createComponent } from '../utils/component.js';
import { fetchData, debounce } from '../utils/api.js';

export async function TodosPage() {
    const container = createComponent('div', { className: 'container' },
        [
            createComponent('h1', { className: 'page-title' }, 'Задачи'),
            createComponent('div', { id: 'todos-content' })
        ]
    );
    
    await renderTodos(container.querySelector('#todos-content'));
    setupSearch(container);
    
    return container;
}

async function renderTodos(container) {
    container.innerHTML = '<div class="loading">Загрузка задач...</div>';
    
    try {
        const todos = await fetchData('todos');
        
        if (todos.length === 0) {
            container.innerHTML = '<div class="empty-state">Задачи не найдены</div>';
            return;
        }
        
        const todosList = createComponent('div', { className: 'cards-container' });
        
        todos.forEach(todo => {
            const todoCard = createTodoCard(todo);
            todosList.appendChild(todoCard);
        });
        
        container.innerHTML = '';
        container.appendChild(todosList);
        
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Ошибка при загрузке задач</div>';
    }
}

function createTodoCard(todo) {
    const card = createComponent('div', { 
        className: `card ${todo.completed ? 'completed' : ''}` 
    },
        [
            createComponent('h3', {}, todo.title),
            createComponent('p', {}, `Статус: ${todo.completed ? 'Выполнено' : 'Не выполнено'}`),
            createComponent('p', {}, `Пользователь ID: ${todo.userId}`)
        ]
    );
    
    return card;
}

function setupSearch(container) {
    const searchInput = document.getElementById('global-search');
    
    const handleSearch = debounce(async (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const todosContent = container.querySelector('#todos-content');
        
        try {
            const todos = await fetchData('todos');
            
            const filteredTodos = searchTerm ? 
                todos.filter(todo => 
                    todo.title.toLowerCase().includes(searchTerm)
                ) : 
                todos;
            
            const todosList = createComponent('div', { className: 'cards-container' });
            
            filteredTodos.forEach(todo => {
                const todoCard = createTodoCard(todo);
                todosList.appendChild(todoCard);
            });
            
            todosContent.innerHTML = '';
            todosContent.appendChild(todosList);
            
        } catch (error) {
            console.error('Error searching todos:', error);
        }
    }, 300);
    
    searchInput.addEventListener('input', handleSearch);
}