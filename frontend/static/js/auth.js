// Функция для управления состоянием загрузки
function setLoading(isLoading) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = isLoading ? 'flex' : 'none';
    }
}

// Функция для получения значения cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Показ уведомлений
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationMessage.textContent = message;
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Выход из системы
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userData');
    window.location.href = 'auth.html';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Функция для показа уведомлений
    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        notificationMessage.textContent = message;
        notification.className = `notification ${isError ? 'error' : 'success'}`;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    // Функция для выхода
    function logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userData');
        window.location.href = 'auth.html';
    }

    // Проверка авторизации при загрузке страницы
    const token = localStorage.getItem('access_token');
    if (token) {
        window.location.href = 'movies.html';
    }

    // Обработчик формы входа
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember-me').checked;

            try {
                const response = await fetch('http://localhost:8000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, remember })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    window.location.href = 'movies.html';
                } else {
                    showNotification(data.detail || 'Ошибка входа', true);
                }
            } catch (error) {
                showNotification('Ошибка сервера', true);
            }
        });
    }

    // Обработчик кнопки выхода
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('visible');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 2000);
}