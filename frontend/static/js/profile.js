// Функция для показа уведомлений
function showNotification(message, isError = false) {
    console.log('Showing notification:', message, 'isError:', isError);
    
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    if (!notification || !messageElement) {
        console.error('Notification elements not found');
        return;
    }
    
    // Обновляем классы и иконку
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    const icon = notification.querySelector('i');
    if (icon) {
        icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    }
    
    messageElement.textContent = message;
    
    // Показываем уведомление
    notification.classList.remove('hidden');
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Функция для показа ошибок в модальных окнах
function showModalError(modalId, message) {
    console.log('Showing modal error:', modalId, message);
    
    const errorElement = document.getElementById(`${modalId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    } else {
        console.error(`Error element not found for modal: ${modalId}`);
    }
}

// Функция для скрытия ошибок в модальных окнах
function hideModalError(modalId) {
    const errorElement = document.getElementById(`${modalId}-error`);
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

// Загрузка данных профиля
function loadProfileData() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            console.log('No user data found, redirecting to auth page');
            window.location.href = 'auth.html';
            return;
        }

        const usernameElement = document.getElementById('username');
        if (!usernameElement) {
            console.error('Username element not found');
            showNotification('Ошибка при загрузке профиля', true);
            return;
        }

        // Отображаем имя пользователя
        usernameElement.textContent = userData.username;
        showNotification('Профиль успешно загружен');
        
    } catch (error) {
        console.error('Error loading profile data:', error);
        showNotification('Ошибка при загрузке данных профиля', true);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing profile page');
    loadProfileData();
    
    // Получаем данные текущего пользователя
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    console.log('Current user data:', currentUser);
    
    // Проверяем наличие токена
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error('No access token found');
        showNotification('Ошибка авторизации. Пожалуйста, войдите снова.', true);
        // Перенаправляем на страницу входа
        window.location.href = '/auth.html';
        return;
    }
    
    // Добавляем обработчики для всех кнопок
    const moviesButton = document.getElementById('movies-button');
    const changeUsernameButton = document.getElementById('change-username-button');
    const changePasswordButton = document.getElementById('change-password-button');
    const deleteButton = document.getElementById('delete-button');
    const logoutButton = document.getElementById('logout-button');
    
    if (moviesButton) {
        moviesButton.addEventListener('click', () => {
            window.location.href = '../template/movies.html';
        });
    }
    
    if (changeUsernameButton) {
        changeUsernameButton.addEventListener('click', () => {
            const modal = document.getElementById('username-modal');
            if (modal) {
                modal.style.display = 'block';
                hideModalError('username');
            }
        });
    }
    
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', () => {
            const modal = document.getElementById('password-modal');
            if (modal) {
                modal.style.display = 'block';
                hideModalError('password');
            }
        });
    }
    
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            const modal = document.getElementById('delete-modal');
            if (modal) {
                modal.style.display = 'block';
                hideModalError('delete');
            }
        });
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:8000/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('userData');
                    showNotification('Выход выполнен успешно');
                    setTimeout(() => {
                        window.location.href = 'auth.html';
                    }, 1000);
                } else {
                    showNotification('Ошибка при выходе из системы', true);
                }
            } catch (error) {
                console.error('Error during logout:', error);
                showNotification('Ошибка при выходе из системы', true);
            }
        });
    }
    
    // Обработчики закрытия модальных окон
    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            const modal = closeButton.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                if (modal.id === 'username-modal') {
                    hideModalError('username');
                } else if (modal.id === 'password-modal') {
                    hideModalError('password');
                } else if (modal.id === 'delete-modal') {
                    hideModalError('delete');
                }
            }
        });
    });
    
    // Обработчик формы смены имени
    const changeUsernameForm = document.getElementById('change-username-form');
    if (changeUsernameForm) {
        changeUsernameForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const newUsername = document.getElementById('new-username');
            const password = document.getElementById('confirm-password-username');
            const errorMessage = document.getElementById('usernameError');
            
            if (!newUsername || !password) {
                console.error('Form elements not found');
                return;
            }

            // Очищаем предыдущие ошибки
            if (errorMessage) {
                errorMessage.style.display = 'none';
                errorMessage.textContent = '';
            }

            // Валидация на стороне клиента
            if (password.value.length < 6) {
                if (errorMessage) {
                    errorMessage.textContent = 'Пароль должен содержать минимум 6 символов';
                    errorMessage.style.display = 'block';
                }
                return;
            }

            if (newUsername.value.length < 3) {
                if (errorMessage) {
                    errorMessage.textContent = 'Имя пользователя должно содержать минимум 3 символа';
                    errorMessage.style.display = 'block';
                }
                return;
            }

            const requestData = {
                username: newUsername.value.trim(),
                email: currentUser.email,
                password: password.value
            };
            
            console.log('Sending request with data:', requestData);
            console.log('Request data type:', typeof requestData);
            console.log('Request data keys:', Object.keys(requestData));
            console.log('Request data username:', requestData.username);
            console.log('Request data email:', requestData.email);
            console.log('Request data password:', requestData.password);
            console.log('Request data stringified:', JSON.stringify(requestData));
            console.log('Request headers:', {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
            
            try {
                const response = await fetch('http://localhost:8000/change-username', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(requestData)
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                
                if (response.status === 401) {
                    // Токен истек или недействителен
                    console.error('Token expired or invalid');
                    showNotification('Сессия истекла. Пожалуйста, войдите снова.', true);
                    // Очищаем данные авторизации
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('userData');
                    // Перенаправляем на страницу входа
                    window.location.href = '/auth.html';
                    return;
                }
                
                const data = await response.json();
                console.log('Response data:', data);
                console.log('Response data type:', typeof data);
                console.log('Response data detail type:', typeof data.detail);
                if (Array.isArray(data.detail)) {
                    console.log('Detail array length:', data.detail.length);
                    console.log('Detail array items:', data.detail);
                    data.detail.forEach((item, index) => {
                        console.log(`Error item ${index}:`, item);
                        console.log(`Error item ${index} type:`, typeof item);
                        console.log(`Error item ${index} keys:`, Object.keys(item));
                        console.log(`Error item ${index} msg:`, item.msg);
                        console.log(`Error item ${index} loc:`, item.loc);
                        console.log(`Error item ${index} type:`, item.type);
                    });
                }
                
                if (response.ok) {
                    // Обновляем имя в интерфейсе
                    const usernameElement = document.getElementById('username');
                    if (usernameElement) {
                        usernameElement.textContent = newUsername.value;
                    }
                    // Обновляем имя в localStorage
                    currentUser.username = newUsername.value;
                    localStorage.setItem('userData', JSON.stringify(currentUser));
                    // Закрываем модальное окно
                    const modal = document.getElementById('changeUsernameModal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                    // Очищаем форму
                    this.reset();
                    // Скрываем сообщение об ошибке
                    if (errorMessage) {
                        errorMessage.style.display = 'none';
                    }
                    // Показываем уведомление об успехе
                    showNotification('Имя пользователя успешно изменено', 'success');
                } else {
                    // Показываем сообщение об ошибке
                    if (errorMessage) {
                        let errorDetail = 'Ошибка при смене имени пользователя';
                        if (data.detail) {
                            if (Array.isArray(data.detail)) {
                                errorDetail = data.detail.map(err => {
                                    console.log('Error item:', err);
                                    return err.msg || err;
                                }).join(', ');
                            } else {
                                errorDetail = data.detail;
                            }
                        }
                        console.error('Error detail:', errorDetail);
                        errorMessage.textContent = errorDetail;
                        errorMessage.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (errorMessage) {
                    errorMessage.textContent = 'Произошла ошибка при смене имени пользователя';
                    errorMessage.style.display = 'block';
                }
            }
        });
    } else {
        console.error('Change username form not found');
    }
    
    // Обработчик формы смены пароля
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideModalError('password');
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            
            try {
                const response = await fetch('http://localhost:8000/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword
                    })
                });

                if (response.ok) {
                    showNotification('Пароль успешно изменен');
                    document.getElementById('password-modal').style.display = 'none';
                    document.getElementById('change-password-form').reset();
                } else {
                    const data = await response.json();
                    showModalError('password', data.detail || 'Ошибка при смене пароля');
                }
            } catch (error) {
                console.error('Error changing password:', error);
                showModalError('password', 'Ошибка при смене пароля');
            }
        });
    }
    
    // Обработчик формы удаления аккаунта
    const deleteForm = document.getElementById('delete-form');
    if (deleteForm) {
        deleteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideModalError('delete');
            
            const password = document.getElementById('confirm-password').value;
            
            try {
                const response = await fetch('http://localhost:8000/delete-account', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify({
                        password: password
                    })
                });

                if (response.ok) {
                    showNotification('Аккаунт успешно удален');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('userData');
                    setTimeout(() => {
                        window.location.href = 'auth.html';
                    }, 1000);
                } else {
                    const data = await response.json();
                    showModalError('delete', data.detail || 'Ошибка при удалении аккаунта');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                showModalError('delete', 'Ошибка при удалении аккаунта');
            }
        });
    }
    
    // Обработчики для кнопок показа/скрытия пароля
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            button.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    });
});