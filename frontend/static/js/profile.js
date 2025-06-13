// Проверяем, авторизован ли пользователь
document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'auth.html';
        return;
    }

    // Заполняем данные пользователя
    document.getElementById('username').textContent = userData.username || 'Не указано';
    document.getElementById('email').textContent = userData.email || 'Не указано';
    
    // Настройка переключения видимости пароля
    const passwordSpan = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');
    const eyeIcon = toggleButton.querySelector('i');
    
    let isPasswordVisible = false;
    
    toggleButton.addEventListener('click', function() {
        isPasswordVisible = !isPasswordVisible;
        passwordSpan.textContent = isPasswordVisible ? userData.password : '••••••••';
        eyeIcon.className = isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
}); 