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
export const obtenerProductos = () => leer('/productos');
export const obtenerProducto = (id) => leer(`/productos/${id}`);

// Blogs
export const obtenerBlogs = () => leer('/blogs');
export const obtenerBlog = (id) => leer(`/blogs/${id}`);

// Categorías
export const obtenerCategorias = () => leer('/categorias');
export const obtenerProductosPorCategoria = (id) => leer(`/productos?categoria=${id}`);

// Ofertas
export const obtenerOfertas = () => leer('/productos?oferta=true');