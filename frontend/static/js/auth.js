document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Скрываем предыдущие уведомления
    hideNotification();
    
    // 1. Собираем данные формы
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        remember: document.getElementById('remember').checked
    };

    // Логируем данные, которые отправляем на сервер
    console.log('Отправляемые данные на сервер (JSON):', JSON.stringify(formData, null, 2));
    console.log('Объект данных:', formData);

    try {
        // 2. Отправляем запрос
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        // 3. Получаем ответ
        const result = await response.json();
        
        // Логируем ответ от сервера
        console.log('Ответ от сервера (JSON):', JSON.stringify(result, null, 2));
        console.log('Объект ответа:', result);
        
        if (!response.ok) {
            // Показываем ошибку
            if (result.detail === 'Wrong email') {
                showNotification('Пользователь с таким email не найден', 'error');
            } else if (result.detail === 'Wrong password') {
                showNotification('Неверный пароль', 'error');
            } else {
                showNotification('Ошибка авторизации', 'error');
            }
        } else {
            // Успешная авторизация
            showNotification('Успешный вход!', 'success');
            
            // Сохраняем данные пользователя
            localStorage.setItem('userData', JSON.stringify({
                username: result.username,
                email: formData.email,
                password: formData.password
            }));
            
            // Перенаправляем на страницу профиля
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        }
        
    } catch (error) {
        console.error("Ошибка при отправке:", error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
});

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    // Сбрасываем классы
    notification.className = 'notification';
    
    // Добавляем нужные классы
    notification.classList.add(type);
    notification.classList.add('visible');
    
    notificationMessage.textContent = message;
    
    // Автоматически скрываем уведомление через 4 секунды
    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300); // Ждем завершения анимации
    }, 4000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('visible');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 2000);
}