// Protección: si no hay sesión, vuelve al login
if (!sessionStorage.getItem('admin')) {
  window.location.href = 'login.html';
}

let todasLasConsultas = [];
let consultaActual = null;

// 1. Traer todas las consultas
async function cargarConsultas() {
  try {
    const respuesta = await fetch('/api/consultas');
    if (!respuesta.ok) throw new Error('Error al obtener las consultas');
    todasLasConsultas = await respuesta.json();
    aplicarFiltros();
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

// 2. Filtrar en el cliente con .filter()
function aplicarFiltros() {
  const filtroEstado = document.getElementById('filtro-estado').value;
  const filtroFecha = document.getElementById('filtro-fecha').value;
  const filtroTexto = document.getElementById('filtro-buscar').value.toLowerCase().trim();

  const filtradas = todasLasConsultas.filter(c => {
    const coincideEstado = filtroEstado === '' || String(c.leida) === filtroEstado;
    const coincideFecha = filtroFecha === '' || c.fecha.slice(0, 10) === filtroFecha;
    const coincideTexto = filtroTexto === '' ||
      c.nombre.toLowerCase().includes(filtroTexto) ||
      c.gmail.toLowerCase().includes(filtroTexto);

    return coincideEstado && coincideFecha && coincideTexto;
  });

  renderizarTabla(filtradas);
}

// 3. Dibujar la tabla
function renderizarTabla(lista) {
  const tbody = document.getElementById('cuerpo-tabla');
  tbody.innerHTML = '';

  lista.forEach(c => {
    const fecha = new Date(c.fecha).toLocaleDateString('es-AR');
    const estado = c.leida ? 'Leída' : 'No leída';

    tbody.innerHTML += `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.gmail}</td>
        <td>${c.asunto}</td>
        <td>${fecha}</td>
        <td>${estado}</td>
        <td><button onclick="verDetalle(${c.id_consulta})">Ver detalle</button></td>
      </tr>
    `;
  });
}

// 4. Detalle de una consulta
async function verDetalle(id) {
  const respuesta = await fetch(`/api/consultas/${id}`);
  const consulta = await respuesta.json();
  consultaActual = consulta;

  document.getElementById('detalle-nombre').textContent = consulta.nombre;
  document.getElementById('detalle-gmail').textContent = consulta.gmail;
  document.getElementById('detalle-telefono').textContent = consulta.telefono || '-';
  document.getElementById('detalle-asunto').textContent = consulta.asunto;
  document.getElementById('detalle-mensaje').textContent = consulta.mensaje;
  document.getElementById('btn-leida').textContent =
    consulta.leida ? 'Marcar como no leída' : 'Marcar como leída';

  document.getElementById('panel-detalle').style.display = 'block';
}

// 5. Marcar leída / no leída
document.getElementById('btn-leida').addEventListener('click', async () => {
  await fetch(`/api/consultas/${consultaActual.id_consulta}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leida: !consultaActual.leida })
  });
  document.getElementById('panel-detalle').style.display = 'none';
  cargarConsultas();
});

document.getElementById('btn-cerrar-detalle').addEventListener('click', () => {
  document.getElementById('panel-detalle').style.display = 'none';
});

// 6. Filtros: se aplican al tocar el botón
document.getElementById('btn-filtrar').addEventListener('click', aplicarFiltros);

// 7. Cerrar sesión
document.getElementById('btnCerrarSesion').addEventListener('click', () => {
  sessionStorage.removeItem('admin');
  window.location.href = 'login.html';
});

cargarConsultas();