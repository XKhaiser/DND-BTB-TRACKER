document.getElementById('dataForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.elements.username.value;
  const email = e.target.elements.email.value;
  const password = e.target.elements.password_hash.value;

  const response = await fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const result = await response.json();
});