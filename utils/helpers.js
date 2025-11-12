// Вспомогательные функции
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

export function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}