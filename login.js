document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!usuario || !password) {
    alert('Completá usuario y contraseña.');
    return;
  }

  try {
    const respuesta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      sessionStorage.setItem('admin', data.usuario);
      window.location.href = 'admin.html';
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert('No se pudo conectar con el servidor.');
  }
});