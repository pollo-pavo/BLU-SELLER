import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/salud', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');
    res.json({ ok: true, hora: resultado.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'No se pudo conectar a la base' });
  }
});

app.get('/api/productos', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, descripcion, precio, stock, imagen FROM productos WHERE activo = TRUE ORDER BY id'
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
});

app.post('/api/registro', async (req, res) => {
  const { nombre, correo, contrasena, telefono, region, comuna } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
  }

  try {
    const hash = await bcrypt.hash(contrasena, 10);
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, telefono, region, comuna)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nombre, correo, rol`,
      [nombre, correo, hash, telefono, region, comuna]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ese correo ya está registrado' });
    }
    console.error(error);
    res.status(500).json({ error: 'No se pudo registrar el usuario' });
  }
});

app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    const resultado = await pool.query(
      'SELECT id, nombre, correo, contrasena, rol FROM usuarios WHERE correo = $1',
      [correo]
    );
    const usuario = resultado.rows[0];

    const coincide = usuario && await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    res.json({ id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
});

app.post('/api/contacto', async (req, res) => {
  const { nombre, correo, contenido } = req.body;

  if (!nombre || !correo || !contenido) {
    return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO mensajes_contacto (nombre, correo, contenido)
       VALUES ($1, $2, $3)
       RETURNING id, fecha_envio`,
      [nombre, correo, contenido]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo guardar el mensaje' });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT b.id, b.titulo, b.descripcion, b.imagen_portada, b.fecha_creacion,
              u.nombre AS autor
       FROM blogs b
       JOIN usuarios u ON u.id = b.autor_id
       WHERE b.activo = TRUE
       ORDER BY b.id`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener los blogs' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});