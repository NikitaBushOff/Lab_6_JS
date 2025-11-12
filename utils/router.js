// Простой роутер для SPA
export class Router {
    constructor() {
        this.routes = {};
        this.defaultRoute = null;
    }
    
    addRoute(hash, callback) {
        this.routes[hash] = callback;
    }
    
    setDefault(hash) {
        this.defaultRoute = hash;
    }
    
    getCurrentHash() {
        return window.location.hash.slice(1) || this.defaultRoute;
    }
    
    navigate(hash) {
        window.location.hash = hash;
    }
    
    start() {
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
        
        // Обрабатываем начальный маршрут
        this.handleRouteChange();
    }
    
    handleRouteChange() {
        const currentHash = this.getCurrentHash();
        const callback = this.routes[currentHash];
        
        if (callback) {
            callback();
        } else if (this.defaultRoute && this.routes[this.defaultRoute]) {
            this.routes[this.defaultRoute]();
        } else {
            console.error('Route not found:', currentHash);
        }
    }
}