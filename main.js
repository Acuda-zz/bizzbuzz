document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-container');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username === 'gwapo' && password === 'gwapo') {
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials!');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').focus();
        }
    });
});