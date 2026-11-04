async function cargarServicios() {
  const contenedor = document.getElementById('lista-servicios');

  try {
    const respuesta = await fetch('/api/servicios');

    if (!respuesta.ok) {
      throw new Error('Error al obtener los datos del servidor');
    }

    const servicios = await respuesta.json();

    contenedor.innerHTML = '';

    servicios.forEach(servicio => {
     contenedor.innerHTML += `
  <div class="tarjeta">
    <i class="bi ${servicio.icono} icono"></i>
    <h2>${servicio.nombre}</h2>
    <p>${servicio.descripcion}</p>
    <p class="precio">${servicio.precio ? '$' + servicio.precio : 'Precio a consultar'}</p>
  </div>
`;
    });

  } catch (error) {
    console.error('Ocurrió un error:', error);
    contenedor.textContent = 'Error al cargar los servicios.';
  }
}

cargarServicios();