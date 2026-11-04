// Parte A: llenar el select con los servicios
async function cargarServicios() {
  const select = document.getElementById('id_servicio');
  try {
    const respuesta = await fetch('/api/servicios');
    const servicios = await respuesta.json();
    servicios.forEach(servicio => {
      select.innerHTML += `<option value="${servicio.id}">${servicio.nombre}</option>`;
    });
  } catch (error) {
    console.error('No se pudieron cargar los servicios:', error);
  }
}

cargarServicios();

// Parte B: validar y enviar el formulario
document.getElementById('formConsulta').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const gmail = document.getElementById('gmail').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const id_servicio = document.getElementById('id_servicio').value;
  const asunto = document.getElementById('asunto').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !gmail || !asunto || !mensaje) {
    alert('Por favor, completá todos los campos obligatorios.');
    return;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(gmail)) {
    alert('Por favor, ingresá un correo electrónico válido.');
    return;
  }

  if (mensaje.length < 10) {
    alert('El mensaje debe tener al menos 10 caracteres.');
    return;
  }

  const datosConsulta = { nombre, telefono, gmail, asunto, mensaje, id_servicio };

  try {
    const respuesta = await fetch('/api/consultas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosConsulta)
    });

    if (respuesta.ok) {
      alert('¡Consulta enviada con éxito!');
      document.getElementById('formConsulta').reset();
    } else {
      alert('Error al enviar la consulta. Intente nuevamente.');
    }
  } catch (error) {
    console.error('Error de red o conexión:', error);
    alert('No se pudo conectar con el servidor.');
  }
});