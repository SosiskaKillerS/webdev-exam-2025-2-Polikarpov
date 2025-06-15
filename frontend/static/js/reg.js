// Функция для управления состоянием загрузки
function setLoading(isLoading) {
    console.log('setLoading called with:', isLoading);
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = isLoading ? 'flex' : 'none';
    }
}

// Функция для показа уведомлений
function showNotification(message, isError = false) {
    console.log('showNotification called with:', message, isError);
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationMessage.textContent = message;
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Тестовая функция
function testFunction() {
    console.log('Test function called');
    showNotification('Тестовое уведомление', false);
}

// Инициализация при загрузке страницы
console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации при загрузке страницы
    const token = localStorage.getItem('access_token');
    if (token) {
        window.location.href = 'movies.html';
    }

    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const userData = {
                username,
                email,
                password
            };

            try {
                const response = await fetch('http://localhost:8000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Регистрация успешна!');
                    localStorage.setItem('userData', JSON.stringify({
                        username: data.user.username,
                        email: data.user.email
                    }));
                    localStorage.setItem('access_token', data.access_token);
                    setTimeout(() => {
                        window.location.href = 'movies.html';
                    }, 1500);
                } else {
                    showNotification(data.detail || 'Ошибка при регистрации', true);
                }
            } catch (error) {
                showNotification('Ошибка сервера', true);
            }
        });
    }
}); 