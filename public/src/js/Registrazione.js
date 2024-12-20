var Login = function (args) {
  this.args = args;
};

Login.prototype.mostraLogin = function () {
  function showMessage(containerId, message, type = 'success') {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div class="message ${type}">
        ${message}
      </div>
    `;
  
    setTimeout(() => {
      container.innerHTML = '';
    }, 5000);
  }
  
  // Login form handler
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password })
      });

      const result = await response.json();

      if (result.error) {
        showMessage('messageContainer', `Errore: ${result.error}`, 'error');
      } else {
        showMessage('messageContainer', result.message, 'success');

        const { username, role, isMaster, id } = result.user;
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        localStorage.setItem('isMaster', isMaster);
        localStorage.setItem('idUser', id)

        window.location.href = '/dashboard.html';
      }
    } catch (error) {
      console.error('Errore:', error);
      showMessage('messageContainer', 'Si è verificato un errore. Riprova più tardi.', 'error');
    }
  });
  
  // Signup form handler
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
    if (password !== confirmPassword) {
      showMessage('messageContainer', 'Le password non coincidono.', 'error');
      return;
    }
  
    if (password.length < 8) {
      showMessage('messageContainer', 'La password deve avere almeno 8 caratteri.', 'error');
      return;
    }
  
    try {
      const response = await fetch('/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', username, password })
      });
  
      const result = await response.json();
  
      if (result.error) {
        showMessage('messageContainer', `Errore: ${result.error}`, 'error');
      } else {
        showMessage('messageContainer', result.message, 'success');
        window.location.href = '/dashboard.html';
      }
    } catch (error) {
      console.error('Errore:', error);
      showMessage('messageContainer', 'Si è verificato un errore. Riprova più tardi.', 'error');
    }
  });
};