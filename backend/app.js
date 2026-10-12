import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcryptjs';
import { validarProducto, validarUsuario, validarCategoria, validarContacto, validarCompra } from './validaciones.js';

const app = express();
app.use(cors());
app.use(express.json());
const aNulo = (v) => (v === undefined || v === '' ? null : v);

process.on('unhandledRejection', (error) => {
  console.error('Error no controlado:', error);
});

app.get('/api/salud', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');
    res.json({ ok: true, hora: resultado.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'No se pudo conectar a la base' });
  }
});

app.get('/api/categorias', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id, nombre FROM categorias ORDER BY id');
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener las categorías' });
  }
});

app.get('/api/productos', async (req, res) => {
  const { categoria, oferta, buscar } = req.query;
  const condiciones = ['p.activo = TRUE'];
  const valores = [];

  if (categoria) {
    if (!Number.isInteger(Number(categoria))) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }
    valores.push(Number(categoria));
    condiciones.push(`p.categoria_id = $${valores.length}`);
  }

  if (oferta === 'true') {
    condiciones.push('p.precio_oferta IS NOT NULL');
  }

  if (buscar) {
    valores.push(`%${buscar}%`);
    condiciones.push(`p.nombre ILIKE $${valores.length}`);
  }

  try {
    const resultado = await pool.query(
      `SELECT p.id, p.codigo, p.nombre, p.descripcion, p.precio, p.precio_oferta,
              p.stock, p.stock_critico, p.imagen,
              p.categoria_id, c.nombre AS categoria
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE ${condiciones.join(' AND ')}
       ORDER BY p.id`,
      valores
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de producto inválido' });
  }
  try {
    const resultado = await pool.query(
      `SELECT p.id, p.codigo, p.nombre, p.descripcion, p.precio, p.precio_oferta,
              p.stock, p.stock_critico, p.imagen,
              p.categoria_id, c.nombre AS categoria
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = $1 AND p.activo = TRUE`,
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener el producto' });
  }
});

app.post('/api/registro', async (req, res) => {
  const mensaje = validarUsuario(req.body);
  if (mensaje) {
    return res.status(400).json({ error: mensaje });
  }

  const { run, nombre, apellidos, correo, contrasena, fecha_nacimiento, telefono, direccion, region, comuna } = req.body;

  try {
    const hash = await bcrypt.hash(contrasena, 10);
    const resultado = await pool.query(
      `INSERT INTO usuarios (run, nombre, apellidos, correo, contrasena, fecha_nacimiento, telefono, direccion, region, comuna)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, nombre, apellidos, correo, rol`,
      [
        String(run).toUpperCase(), nombre.trim(), apellidos.trim(), correo.trim().toLowerCase(), hash,
        aNulo(fecha_nacimiento), aNulo(telefono), direccion.trim(), region, comuna,
      ]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      const campo = error.constraint === 'usuarios_run_key' ? 'RUN' : 'correo';
      return res.status(409).json({ error: `Ese ${campo} ya está registrado` });
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
      'SELECT id, nombre, apellidos, correo, contrasena, rol, direccion, region, comuna FROM usuarios WHERE LOWER(correo) = LOWER($1)',
      [correo]
    );
    const usuario = resultado.rows[0];

    const coincide = usuario && await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

      res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      rol: usuario.rol,
      direccion: usuario.direccion,
      region: usuario.region,
      comuna: usuario.comuna,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
});

app.post('/api/contacto', async (req, res) => {
  const { nombre, correo, contenido } = req.body;

  const errorValidacion = validarContacto(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
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

app.get('/api/blogs/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de blog inválido' });
  }

  try {
    const resultado = await pool.query(
      `SELECT b.id, b.titulo, b.descripcion, b.contenido, b.imagen_portada, b.fecha_creacion,
              u.nombre AS autor
       FROM blogs b
       JOIN usuarios u ON u.id = b.autor_id
       WHERE b.id = $1 AND b.activo = TRUE`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Blog no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener el blog' });
  }
});

app.post('/api/ordenes', async (req, res) => {
  const { usuario_id, nombre, apellidos, correo, calle, departamento, region, comuna, indicaciones, items } = req.body;

  const errorValidacion = validarCompra(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');

    let total = 0;
    const lineas = [];

    for (const item of items) {
      const resultado = await cliente.query(
        'SELECT id, nombre, precio, precio_oferta, stock FROM productos WHERE id = $1 AND activo = TRUE FOR UPDATE',
        [item.id]
      );
      const producto = resultado.rows[0];

      if (!producto) {
        await cliente.query('ROLLBACK');
        return res.status(404).json({ error: `El producto ${item.id} ya no está disponible` });
      }
      if (producto.stock < item.cantidad) {
        await cliente.query('ROLLBACK');
        return res.status(409).json({ error: `Stock insuficiente para ${producto.nombre}` });
      }

      await cliente.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.cantidad, item.id]);

      const precio = Number(producto.precio_oferta ?? producto.precio);
      total += precio * item.cantidad;
      lineas.push({ producto, precio, cantidad: item.cantidad });
    }

    total = Math.round(total * 100) / 100;

    const orden = await cliente.query(
      `INSERT INTO ordenes (usuario_id, nombre, apellidos, correo, calle, departamento, region, comuna, indicaciones, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, total, estado, fecha_creacion`,
      [usuario_id || null, nombre, apellidos, correo, calle, departamento || null, region, comuna, indicaciones || null, total]
    );
    const ordenId = orden.rows[0].id;

    for (const linea of lineas) {
      await cliente.query(
        `INSERT INTO orden_items (orden_id, producto_id, nombre, precio_unitario, cantidad)
         VALUES ($1, $2, $3, $4, $5)`,
        [ordenId, linea.producto.id, linea.producto.nombre, linea.precio, linea.cantidad]
      );
    }

    await cliente.query('COMMIT');
    res.status(201).json(orden.rows[0]);
  } catch (error) {
    await cliente.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'No se pudo registrar la compra' });
  } finally {
    cliente.release();
  }
});

app.get('/api/ordenes/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de orden inválido' });
  }

  try {
    const orden = await pool.query(
      `SELECT id, usuario_id, nombre, apellidos, correo, calle, departamento,
              region, comuna, indicaciones, total, estado, fecha_creacion
       FROM ordenes WHERE id = $1`,
      [id]
    );

    if (orden.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const items = await pool.query(
      `SELECT producto_id, nombre, precio_unitario, cantidad
       FROM orden_items WHERE orden_id = $1 ORDER BY id`,
      [id]
    );

    res.json({ ...orden.rows[0], items: items.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener la orden' });
  }
});

// ---------- Administración de productos ----------

const COLUMNAS_ADMIN = `p.id, p.codigo, p.nombre, p.descripcion, p.precio, p.precio_oferta,
  p.stock, p.stock_critico, p.imagen, p.activo, p.categoria_id, c.nombre AS categoria`;

app.get('/api/admin/productos', async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT ${COLUMNAS_ADMIN}
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       ORDER BY p.id`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
});

app.get('/api/admin/productos/criticos', async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT ${COLUMNAS_ADMIN}
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.stock <= p.stock_critico
       ORDER BY p.stock, p.id`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener los productos críticos' });
  }
});

app.get('/api/admin/productos/reportes', async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT COUNT(*)::int AS total,
              COALESCE(SUM(stock), 0)::int AS stock_total,
              COALESCE(SUM(precio * stock), 0)::float AS valor_inventario,
              COUNT(*) FILTER (WHERE stock <= stock_critico)::int AS criticos
       FROM productos
       WHERE activo = TRUE`
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo generar el reporte' });
  }
});

app.get('/api/admin/productos/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de producto inválido' });
  }

  try {
    const resultado = await pool.query(
      `SELECT ${COLUMNAS_ADMIN}
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = $1`,
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener el producto' });
  }
});

app.post('/api/admin/productos', async (req, res) => {
  const mensaje = validarProducto(req.body);
  if (mensaje) {
    return res.status(400).json({ error: mensaje });
  }

  const { codigo, nombre, descripcion, precio, precio_oferta, stock, stock_critico, categoria_id, imagen } = req.body;

  try {
    const resultado = await pool.query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio, precio_oferta, stock, stock_critico, categoria_id, imagen)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 5), $8, $9)
       RETURNING id`,
      [
        String(codigo).trim(), String(nombre).trim(), aNulo(descripcion), precio,
        aNulo(precio_oferta), stock, aNulo(stock_critico), categoria_id, aNulo(imagen),
      ]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un producto con ese código' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ error: 'La categoría no existe' });
    }
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear el producto' });
  }
});

app.put('/api/admin/productos/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de producto inválido' });
  }

  const mensaje = validarProducto(req.body);
  if (mensaje) {
    return res.status(400).json({ error: mensaje });
  }

  const { codigo, nombre, descripcion, precio, precio_oferta, stock, stock_critico, categoria_id, imagen } = req.body;

  try {
    const resultado = await pool.query(
      `UPDATE productos
       SET codigo = $1, nombre = $2, descripcion = $3, precio = $4, precio_oferta = $5,
           stock = $6, stock_critico = COALESCE($7, stock_critico), categoria_id = $8, imagen = $9
       WHERE id = $10
       RETURNING id`,
      [
        String(codigo).trim(), String(nombre).trim(), aNulo(descripcion), precio,
        aNulo(precio_oferta), stock, aNulo(stock_critico), categoria_id, aNulo(imagen), id,
      ]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un producto con ese código' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ error: 'La categoría no existe' });
    }
    console.error(error);
    res.status(500).json({ error: 'No se pudo actualizar el producto' });
  }
});

// ---------- Administración de categorías ----------
app.get('/api/admin/categorias/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de categoría inválido' });
  }

  try {
    const resultado = await pool.query('SELECT id, nombre FROM categorias WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener la categoría' });
  }
});

app.post('/api/admin/categorias', async (req, res) => {
  const mensaje = validarCategoria(req.body);
  if (mensaje) {
    return res.status(400).json({ error: mensaje });
  }
  const nombre = String(req.body.nombre).trim();

  try {
    const existente = await pool.query(
      'SELECT 1 FROM categorias WHERE LOWER(nombre) = LOWER($1)',
      [nombre]
    );
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }

    const resultado = await pool.query(
      'INSERT INTO categorias (nombre) VALUES ($1) RETURNING id, nombre',
      [nombre]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear la categoría' });
  }
});

app.put('/api/admin/categorias/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de categoría inválido' });
  }

  const mensaje = validarCategoria(req.body);
  if (mensaje) {
    return res.status(400).json({ error: mensaje });
  }
  const nombre = String(req.body.nombre).trim();

  try {
    const existente = await pool.query(
      'SELECT 1 FROM categorias WHERE LOWER(nombre) = LOWER($1) AND id <> $2',
      [nombre, id]
    );
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }

    const resultado = await pool.query(
      'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING id, nombre',
      [nombre, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    console.error(error);
    res.status(500).json({ error: 'No se pudo actualizar la categoría' });
  }
});

// Administración de categorías
export const adminObtenerCategoria = (id) => leer(`/admin/categorias/${id}`);
export const adminCrearCategoria = (datos) => crear('/admin/categorias', datos);
export const adminActualizarCategoria = (id, datos) => actualizar(`/admin/categorias/${id}`, datos);

// ---------- Administración de usuarios ----------
const COLUMNAS_USUARIO = `id, run, nombre, apellidos, correo, telefono, direccion, region, comuna, rol,
  to_char(fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento, fecha_creacion`;

app.get('/api/admin/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query(`SELECT ${COLUMNAS_USUARIO} FROM usuarios ORDER BY id`);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener los usuarios' });
  }
});

app.get('/api/admin/usuarios/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de usuario inválido' });
  }

  try {
    const resultado = await pool.query(`SELECT ${COLUMNAS_USUARIO} FROM usuarios WHERE id = $1`, [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener el usuario' });
  }
});

app.get('/api/admin/usuarios/:id/historial', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de usuario inválido' });
  }

  try {
    const resultado = await pool.query(
      'SELECT id, fecha_creacion, estado, total FROM ordenes WHERE usuario_id = $1 ORDER BY id DESC',
      [id]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener el historial de compras' });
  }
});

app.post('/api/admin/usuarios', async (req, res) => {
  const mensaje = validarUsuario(req.body);
  if (mensaje) {
    return res.status(400).json({ error: mensaje });
  }

  const { run, nombre, apellidos, correo, contrasena, fecha_nacimiento, telefono, direccion, region, comuna, rol } = req.body;

  try {
    const hash = await bcrypt.hash(contrasena, 10);
    const resultado = await pool.query(
      `INSERT INTO usuarios (run, nombre, apellidos, correo, contrasena, fecha_nacimiento, telefono, direccion, region, comuna, rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, 'cliente'))
       RETURNING id`,
      [
        String(run).toUpperCase(), nombre.trim(), apellidos.trim(), correo.trim().toLowerCase(), hash,
        aNulo(fecha_nacimiento), aNulo(telefono), direccion.trim(), region, comuna, aNulo(rol),
      ]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      const campo = error.constraint === 'usuarios_run_key' ? 'RUN' : 'correo';
      return res.status(409).json({ error: `Ese ${campo} ya está registrado` });
    }
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear el usuario' });
  }
});

app.put('/api/admin/usuarios/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id de usuario inválido' });
  }

  const mensaje = validarUsuario(req.body, { contrasenaObligatoria: false });
  if (mensaje) {
    return res.status(400).json({ error: mensaje });
  }

  const { run, nombre, apellidos, correo, fecha_nacimiento, telefono, direccion, region, comuna, rol } = req.body;

  try {
    const resultado = await pool.query(
      `UPDATE usuarios
       SET run = $1, nombre = $2, apellidos = $3, correo = $4, fecha_nacimiento = $5,
           telefono = $6, direccion = $7, region = $8, comuna = $9, rol = COALESCE($10, rol)
       WHERE id = $11
       RETURNING id`,
      [
        String(run).toUpperCase(), nombre.trim(), apellidos.trim(), correo.trim().toLowerCase(),
        aNulo(fecha_nacimiento), aNulo(telefono), direccion.trim(), region, comuna, aNulo(rol), id,
      ]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      const campo = error.constraint === 'usuarios_run_key' ? 'RUN' : 'correo';
      return res.status(409).json({ error: `Ese ${campo} ya está registrado` });
    }
    console.error(error);
    res.status(500).json({ error: 'No se pudo actualizar el usuario' });
  }
});

// ---------- Administración de órdenes ----------
app.get('/api/admin/ordenes', async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, fecha_creacion, nombre || ' ' || apellidos AS cliente, correo, estado, total
       FROM ordenes
       ORDER BY id DESC`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener las órdenes' });
  }
});

app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const [resumen, criticos, ultimas] = await Promise.all([
      pool.query(
        `SELECT
           COALESCE(SUM(total) FILTER (WHERE estado <> 'cancelada'), 0)::float AS ventas_totales,
           COUNT(*)::int AS ordenes,
           COUNT(*) FILTER (WHERE estado = 'pagada')::int AS pendientes,
           (SELECT COUNT(*)::int FROM usuarios) AS usuarios
         FROM ordenes`
      ),
      pool.query(
        `SELECT id, nombre, stock, stock_critico
         FROM productos
         WHERE activo = TRUE AND stock <= stock_critico
         ORDER BY stock, id`
      ),
      pool.query(
        `SELECT id, nombre || ' ' || apellidos AS cliente, estado, total::float AS total
         FROM ordenes
         ORDER BY id DESC
         LIMIT 5`
      ),
    ]);
    res.json({
      ...resumen.rows[0],
      productos_criticos: criticos.rows,
      ultimas_ordenes: ultimas.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener el dashboard' });
  }
});

app.get('/api/admin/reportes', async (req, res) => {
  try {
    const [resumen, estados, masVendidos] = await Promise.all([
      pool.query(
        `SELECT
           COALESCE(SUM(total) FILTER (WHERE estado <> 'cancelada'), 0)::float AS ventas_totales,
           COUNT(*)::int AS ordenes,
           COALESCE(ROUND(AVG(total) FILTER (WHERE estado <> 'cancelada')), 0)::float AS ticket_promedio,
           (SELECT COUNT(*)::int FROM usuarios WHERE rol = 'cliente') AS clientes
         FROM ordenes`
      ),
      pool.query(
        `SELECT e.estado, COUNT(o.id)::int AS cantidad
         FROM (VALUES ('pagada'), ('enviada'), ('entregada'), ('cancelada')) AS e(estado)
         LEFT JOIN ordenes o ON o.estado = e.estado
         GROUP BY e.estado`
      ),
      pool.query(
        `SELECT oi.producto_id AS id, oi.nombre, SUM(oi.cantidad)::int AS unidades
         FROM orden_items oi
         JOIN ordenes o ON o.id = oi.orden_id
         WHERE o.estado <> 'cancelada'
         GROUP BY oi.producto_id, oi.nombre
         ORDER BY unidades DESC, oi.nombre`
      ),
    ]);
    const orden = ['pagada', 'enviada', 'entregada', 'cancelada'];
    res.json({
      ...resumen.rows[0],
      por_estado: orden.map((e) => estados.rows.find((r) => r.estado === e)),
      mas_vendidos: masVendidos.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo generar el reporte' });
  }
});

export default app;