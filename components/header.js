import { createComponent } from '../utils/component.js';
import { Router } from '../utils/router.js';

export function Header() {
    const router = new Router();
    
    const header = createComponent('header', {},
        createComponent('div', { className: 'container header-content' },
            [
                createComponent('div', { className: 'logo' }, 'SPA Lab6'),
                createComponent('div', { className: 'search-container' },
                    [
                        createComponent('input', {
                            type: 'text',
                            className: 'search-input',
                            placeholder: 'Поиск...',
                            id: 'global-search'
                        }),
                        createComponent('button', {
                            className: 'btn',
                            onclick: () => handleAddUser()
                        }, 'Добавить пользователя')
                    ]
                )
            ]
        )
    );
    
    function handleAddUser() {
        // Здесь будет логика добавления пользователя
        console.log('Add user clicked');
    }
    
    return header;
}