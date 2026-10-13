import datos from './ubicaciones.json';

export const regiones = datos.regiones.map((r) => ({
  nombre: r.region,
  comunas: r.comunas,
}));