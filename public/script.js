document.addEventListener('DOMContentLoaded', () => {
  // Login form handler
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.error) {
        showMessage('messageContainer', `Errore: ${result.error}`, 'error');
      } else {
        showMessage('messageContainer', result.message, 'success');

        // Estrarre i dati dell'utente
        const { username, role, isMaster } = result.user;

        // Salvare i dati nel localStorage (opzionale)
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        localStorage.setItem('isMaster', isMaster);

        // Redirect alla dashboard
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 2000); // Attendi 2 secondi prima del redirect
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
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validazione lato client
    if (password !== confirmPassword) {
      showMessage('messageContainer', 'Le password non coincidono.', 'error');
      return;
    }

    if (password.length < 8) {
      showMessage('messageContainer', 'La password deve avere almeno 8 caratteri.', 'error');
      return;
    }

    const response = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();
    if (result.error) {
      showMessage('messageContainer', `Errore: ${result.error}`, 'error');
    } else {
      showMessage('messageContainer', 'Registrazione completata con successo!', 'success');
    }
  });
});

function showMessage(containerId, message, type = 'success') {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="message ${type}">
      ${message}
    </div>
  `;

  // Rimuovi il messaggio dopo 5 secondi
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}
