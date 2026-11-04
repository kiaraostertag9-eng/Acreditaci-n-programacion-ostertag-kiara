document.getElementById('formRegistro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const asunto = document.getElementById('asunto').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !asunto || !mensaje) {
    alert('Por favor, completá todos los campos.');
    return;
  }

  const datos = { nombre, asunto, mensaje };

  try {
    const respuesta = await fetch('/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (respuesta.ok) {
      alert('¡Mensaje enviado correctamente!');
      document.getElementById('formRegistro').reset();
    } else {
      alert('Error al enviar el mensaje');
    }
  } catch (error) {
    alert('Error de conexión con el servidor');
    console.error(error);
  }
});