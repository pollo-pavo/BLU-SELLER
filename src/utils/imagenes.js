// Imagen de cada categoría, según su nombre (sin tildes ni mayúsculas)
const IMAGENES_CATEGORIA = {
  peliculas: '/imagenes/categorias/peliculas.jpg',
  series: '/imagenes/categorias/series.jpg',
  'ediciones especiales': '/imagenes/categorias/ediciones-especiales.jpg',
  sagas: '/imagenes/categorias/sagas.jpg',
};

export const imagenCategoria = (nombre) =>
  IMAGENES_CATEGORIA[
    String(nombre).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
  ];
