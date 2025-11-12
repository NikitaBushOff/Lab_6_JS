// Утилита для создания компонентов
export function createComponent(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    // Устанавливаем атрибуты
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            for (const [dataKey, dataValue] of Object.entries(value)) {
                element.dataset[dataKey] = dataValue;
            }
        } else {
            element.setAttribute(key, value);
        }
    }
    
    // Добавляем контент
    if (typeof content === 'string') {
        element.innerHTML = content;
    } else if (Array.isArray(content)) {
        content.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
    } else if (content instanceof Node) {
        element.appendChild(content);
    }
    
    return element;
}

// Базовый класс для компонентов
export class BaseComponent {
    constructor() {
        this.element = null;
    }
    
    render() {
        throw new Error('Method render() must be implemented');
    }
}