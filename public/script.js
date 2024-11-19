document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const value = e.target.elements.data.value;
  
    const response = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });
  
    const result = await response.json();
    document.getElementById('response').innerText = `Dato salvato con ID: ${result.id}`;
  });