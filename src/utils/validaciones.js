export const PATRON_CORREO = '[^@\\s]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)';
export const TEXTO_CORREO = 'Debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com';

export function validarRun(run) {
  const r = String(run).toUpperCase();
  if (!/^\d{6,8}[0-9K]$/.test(r)) return false;

  const cuerpo = r.slice(0, -1);
  const dv = r.slice(-1);
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === esperado;
}