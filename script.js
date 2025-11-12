import { Router } from './utils/router.js';
import { createComponent } from './utils/component.js';
import { Header } from './components/header.js';
import { Breadcrumbs } from './components/breadcrumbs.js';
import { UsersPage } from './components/users.js';
import { TodosPage } from './components/todos.js';
import { PostsPage } from './components/posts.js';
import { CommentsPage } from './components/comments.js';

class App {
    constructor() {
        this.app = document.getElementById('app');
        this.router = new Router();
        this.currentPage = null;
        
        this.init();
    }
    
    init() {
        this.render();
        this.setupRouter();
    }
    
    render() {
        // Очищаем приложение
        this.app.innerHTML = '';
        
        // Создаем и добавляем компоненты
        const header = Header();
        const breadcrumbs = Breadcrumbs();
        const main = createComponent('main', { id: 'main-content' });
        
        this.app.appendChild(header);
        this.app.appendChild(breadcrumbs);
        this.app.appendChild(main);
        
        this.mainContent = main;
    }
    
    setupRouter() {
        // Определяем маршруты
        this.router.addRoute('users', () => this.showPage(UsersPage));
        this.router.addRoute('users#todos', () => this.showPage(TodosPage));
        this.router.addRoute('users#posts', () => this.showPage(PostsPage));
        this.router.addRoute('users#posts#comments', () => this.showPage(CommentsPage));
        
        // Маршрут по умолчанию
        this.router.setDefault('users');
        
        // Запускаем роутер
        this.router.start();
    }
    
    async showPage(PageComponent) {
        if (this.currentPage) {
            this.mainContent.removeChild(this.currentPage);
        }
        
        const loading = createComponent('div', { className: 'loading' }, 'Загрузка...');
        this.mainContent.appendChild(loading);
        
        try {
            const page = await PageComponent();
            this.mainContent.removeChild(loading);
            this.mainContent.appendChild(page);
            this.currentPage = page;
        } catch (error) {
            console.error('Error loading page:', error);
            this.mainContent.removeChild(loading);
            const errorMsg = createComponent('div', { className: 'empty-state' }, 'Произошла ошибка при загрузке данных');
            this.mainContent.appendChild(errorMsg);
            this.currentPage = errorMsg;
        }
    }
}

// Запускаем приложение когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new App();
});