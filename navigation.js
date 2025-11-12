// Данные для навигации и breadcrumbs
export const navigation = {
    'users': {
        title: 'Пользователи',
        path: '#users'
    },
    'users#todos': {
        title: 'Задачи',
        path: '#users#todos',
        parent: 'users'
    },
    'users#posts': {
        title: 'Посты',
        path: '#users#posts',
        parent: 'users'
    },
    'users#posts#comments': {
        title: 'Комментарии',
        path: '#users#posts#comments',
        parent: 'users#posts'
    }
};

export function getBreadcrumbs(path) {
    const crumbs = [];
    let current = navigation[path];
    
    while (current) {
        crumbs.unshift(current);
        current = current.parent ? navigation[current.parent] : null;
    }
    
    return crumbs;
}