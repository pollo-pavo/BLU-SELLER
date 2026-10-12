const BASE = '/api';

async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  });
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(datos?.error || 'Error en la solicitud');
  }
  return datos;
}

export const leer = (ruta) => solicitar(ruta);

export const crear = (ruta, datos) =>
  solicitar(ruta, { method: 'POST', body: JSON.stringify(datos) });

export const actualizar = (ruta, datos) =>
  solicitar(ruta, { method: 'PUT', body: JSON.stringify(datos) });

export const eliminar = (ruta) =>
  solicitar(ruta, { method: 'DELETE' });

// Productos
export const obtenerProductos = (buscar = '') =>
  leer(buscar ? `/productos?buscar=${encodeURIComponent(buscar)}` : '/productos');
export const obtenerProducto = (id) => leer(`/productos/${id}`);

// Blogs
export const obtenerBlogs = () => leer('/blogs');
export const obtenerBlog = (id) => leer(`/blogs/${id}`);

// Categorías
export const obtenerCategorias = () => leer('/categorias');
export const obtenerProductosPorCategoria = (id) => leer(`/productos?categoria=${id}`);

// Ofertas
export const obtenerOfertas = () => leer('/productos?oferta=true');

// Administración de productos
export const adminObtenerProductos = () => leer('/admin/productos');
export const adminObtenerProducto = (id) => leer(`/admin/productos/${id}`);
export const adminObtenerCriticos = () => leer('/admin/productos/criticos');
export const adminObtenerReporteProductos = () => leer('/admin/productos/reportes');
export const adminCrearProducto = (datos) => crear('/admin/productos', datos);
export const adminActualizarProducto = (id, datos) => actualizar(`/admin/productos/${id}`, datos);

// Órdenes
export const crearOrden = (datos) => crear('/ordenes', datos);
export const obtenerOrden = (id) => leer(`/ordenes/${id}`);

// Administración de categorías
export const adminObtenerCategoria = (id) => leer(`/admin/categorias/${id}`);
export const adminCrearCategoria = (datos) => crear('/admin/categorias', datos);
export const adminActualizarCategoria = (id, datos) => actualizar(`/admin/categorias/${id}`, datos);

// Administración de usuarios
export const adminObtenerUsuarios = () => leer('/admin/usuarios');
export const adminObtenerUsuario = (id) => leer(`/admin/usuarios/${id}`);
export const adminObtenerHistorial = (id) => leer(`/admin/usuarios/${id}/historial`);
export const adminCrearUsuario = (datos) => crear('/admin/usuarios', datos);
export const adminActualizarUsuario = (id, datos) => actualizar(`/admin/usuarios/${id}`, datos);

// Administración de órdenes
export const adminObtenerOrdenes = () => leer('/admin/ordenes');