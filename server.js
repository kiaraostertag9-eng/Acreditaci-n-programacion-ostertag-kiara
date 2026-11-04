const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend/Public')));

app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor!');
});

app.get('/api/servicios', (req, res) => {
  const sql = 'SELECT * FROM servicios';

  db.query(sql, (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los servicios' });
    }
    res.json(resultados);
  });
});



app.post('/api/consultas', (req, res) => {
  const { nombre, telefono, gmail, asunto, mensaje, id_servicio } = req.body;

  if (!nombre || !gmail || !asunto || !mensaje) {
  return res.status(400).json({ error: 'Faltan datos' });
}

  const sql = 'INSERT INTO consultas (nombre, telefono, gmail, asunto, mensaje, id_servicio) VALUES (?, ?, ?, ?, ?, ?)';

 db.query(sql, [nombre, telefono || null, gmail, asunto, mensaje, id_servicio || null], (err, resultado) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al guardar la consulta' });
    }
    res.status(201).json({ mensaje: 'Consulta enviada correctamente' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;

  const sql = 'SELECT id, usuario FROM administradores WHERE usuario = ? AND password = ?';
  db.query(sql, [usuario, password], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (resultados.length > 0) {
      res.json({ ok: true, usuario: resultados[0].usuario });
    } else {
      res.status(401).json({ ok: false, error: 'Usuario o contraseña incorrectos' });
    }
  });
});

// Listado con filtros
app.get('/api/consultas', (req, res) => {
  const { estado, fecha, buscar } = req.query;

  let sql = 'SELECT * FROM consultas WHERE 1=1';
  const params = [];

  if (estado === '0' || estado === '1') {
    sql += ' AND leida = ?';
    params.push(estado);
  }
  if (fecha) {
    sql += ' AND DATE(fecha) = ?';
    params.push(fecha);
  }
  if (buscar) {
    sql += ' AND (nombre LIKE ? OR gmail LIKE ?)';
    params.push(`%${buscar}%`, `%${buscar}%`);
  }
  sql += ' ORDER BY fecha DESC';

  db.query(sql, params, (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener las consultas' });
    }
    res.json(resultados);
  });
});

// Detalle de una consulta
app.get('/api/consultas/:id', (req, res) => {
  const sql = 'SELECT * FROM consultas WHERE id_consulta = ?';
  db.query(sql, [req.params.id], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener la consulta' });
    }
    if (resultados.length === 0) {
      return res.status(404).json({ error: 'Consulta no encontrada' });
    }
    res.json(resultados[0]);
  });
});

// Marcar leída / no leída
app.put('/api/consultas/:id', (req, res) => {
  const { leida } = req.body;
  const sql = 'UPDATE consultas SET leida = ? WHERE id_consulta = ?';
  db.query(sql, [leida ? 1 : 0, req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar' });
    }
    res.json({ mensaje: 'Estado actualizado' });
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});