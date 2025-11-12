import { createComponent } from '../utils/component.js';
import { getBreadcrumbs } from '../data/navigation.js';
import { Router } from '../utils/router.js';

export function Breadcrumbs() {
    const router = new Router();
    
    const breadcrumbs = createComponent('nav', { className: 'breadcrumbs' },
        createComponent('div', { className: 'container' },
            createComponent('ul', { className: 'breadcrumbs-list', id: 'breadcrumbs-list' })
        )
    );
    
    function updateBreadcrumbs() {
        const currentPath = router.getCurrentHash();
        const crumbs = getBreadcrumbs(currentPath);
        const breadcrumbsList = breadcrumbs.querySelector('#breadcrumbs-list');
        
        breadcrumbsList.innerHTML = '';
        
        crumbs.forEach((crumb, index) => {
            const li = createComponent('li', { className: 'breadcrumbs-item' },
                [
                    createComponent('a', {
                        className: 'breadcrumbs-link',
                        href: crumb.path,
                        textContent: crumb.title
                    }),
                    index < crumbs.length - 1 ? 
                        createComponent('span', { className: 'breadcrumbs-separator' }, '›') : 
                        null
                ].filter(Boolean)
            );
            
            breadcrumbsList.appendChild(li);
        });
    }
    
    // Обновляем breadcrumbs при изменении маршрута
    window.addEventListener('hashchange', updateBreadcrumbs);
    
    // Инициализируем при первой загрузке
    setTimeout(updateBreadcrumbs, 0);
    
    return breadcrumbs;
}