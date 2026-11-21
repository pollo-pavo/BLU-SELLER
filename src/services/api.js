const BASE = '/api/v1';
const CLAVE = 'sesion';

export const leerSesion = () => {
  try { return JSON.parse(localStorage.getItem(CLAVE)); } catch { return null; }
};
export const guardarSesion = (s) => localStorage.setItem(CLAVE, JSON.stringify(s));
export const borrarSesion = () => localStorage.removeItem(CLAVE);

let alExpirar = () => {};
export const onSesionExpirada = (fn) => { alExpirar = fn; };

let renovando = null;
function renovarToken() {
  if (!renovando) {
    renovando = (async () => {
      const sesion = leerSesion();
      if (!sesion?.refreshToken) throw new Error('Sin sesión');
      const r = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: sesion.refreshToken }),
      });
      if (!r.ok) throw new Error('No se pudo renovar');
      const d = await r.json();
      guardarSesion({ ...sesion, token: d.token, refreshToken: d.refreshToken ?? sesion.refreshToken });
      return d.token;
    })().finally(() => { renovando = null; });
  }
  return renovando;
}

const enviar = (ruta, opciones, token) =>
  fetch(`${BASE}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

async function solicitar(ruta, { publica, ...opciones } = {}) {
  let respuesta = await enviar(ruta, opciones, publica ? null : leerSesion()?.token);

  if (respuesta.status === 401 && !publica) {
    try {
      respuesta = await enviar(ruta, opciones, await renovarToken());
    } catch {
      alExpirar();
      throw new Error('Tu sesión expiró');
    }
    if (respuesta.status === 401) {
      alExpirar();
      throw new Error('Tu sesión expiró');
    }
  }

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new Error(datos?.error || 'Error en la solicitud');
  return datos;
}

export const leer = (ruta) => solicitar(ruta);
export const crear = (ruta, datos, extra) =>
  solicitar(ruta, { method: 'POST', body: JSON.stringify(datos), ...extra });
export const actualizar = (ruta, datos) =>
  solicitar(ruta, { method: 'PUT', body: JSON.stringify(datos) });
export const eliminar = (ruta) => solicitar(ruta, { method: 'DELETE' });


// Auth (públicas: un 401 aquí no dispara renovación)
export const login = (correo, contrasena) =>
  crear('/auth/login', { correo, contrasena }, { publica: true });

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

// Dashboard y reportes (admin)
export const adminObtenerDashboard = () => leer('/admin/dashboard');
export const adminObtenerReportes = () => leer('/admin/reportes');

// Eliminaciones (admin)
export const adminEliminarProducto = (id) => eliminar(`/admin/productos/${id}`);
export const adminEliminarCategoria = (id) => eliminar(`/admin/categorias/${id}`);
export const adminEliminarUsuario = (id) => eliminar(`/admin/usuarios/${id}`);