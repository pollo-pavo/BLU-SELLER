import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcryptjs';
import { validarProducto, validarUsuario, validarCategoria } from './validaciones.js';

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

  if (!nombre || !apellidos || !correo || !calle || !region || !comuna) {
    return res.status(400).json({ error: 'Faltan datos obligatorios del cliente o de la entrega' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }
  const itemsValidos = items.every(
    (i) => Number.isInteger(i.id) && Number.isInteger(i.cantidad) && i.cantidad > 0
  );
  if (!itemsValidos) {
    return res.status(400).json({ error: 'Los productos del carrito son inválidos' });
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

