const vacio = (v) => v === undefined || v === null || v === '';

export function validarProducto(d) {
  if (vacio(d.codigo) || String(d.codigo).trim().length < 3) {
    return 'El código es obligatorio (mínimo 3 caracteres)';
  }
  if (vacio(d.nombre) || String(d.nombre).trim() === '' || String(d.nombre).length > 100) {
    return 'El nombre es obligatorio (máximo 100 caracteres)';
  }
  if (!vacio(d.descripcion) && String(d.descripcion).length > 500) {
    return 'La descripción admite un máximo de 500 caracteres';
  }
  if (vacio(d.precio) || Number.isNaN(Number(d.precio)) || Number(d.precio) < 0) {
    return 'El precio es obligatorio y no puede ser negativo';
  }
  if (!vacio(d.precio_oferta) && (Number.isNaN(Number(d.precio_oferta)) || Number(d.precio_oferta) < 0)) {
    return 'El precio de oferta no puede ser negativo';
  }
  if (vacio(d.stock) || !Number.isInteger(Number(d.stock)) || Number(d.stock) < 0) {
    return 'El stock es obligatorio y debe ser un entero mayor o igual a 0';
  }
  if (!vacio(d.stock_critico) && (!Number.isInteger(Number(d.stock_critico)) || Number(d.stock_critico) < 0)) {
    return 'El stock crítico debe ser un entero mayor o igual a 0';
  }
  if (vacio(d.categoria_id) || !Number.isInteger(Number(d.categoria_id))) {
    return 'La categoría es obligatoria';
  }
  return null;
}

const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

export function correoPermitido(correo) {
  const c = String(correo).trim().toLowerCase();
  return (
    c.length <= 100 &&
    /^[^\s@]+@[^\s@]+$/.test(c) &&
    DOMINIOS_PERMITIDOS.some((dominio) => c.endsWith(dominio))
  );
}

// RUN chileno sin puntos ni guion, 7 a 9 caracteres, con dígito verificador (módulo 11)
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

export function validarUsuario(d, { contrasenaObligatoria = true } = {}) {
  if (vacio(d.run) || !validarRun(d.run)) {
    return 'El RUN es inválido (7 a 9 caracteres, sin puntos ni guion, con dígito verificador correcto)';
  }
  if (vacio(d.nombre) || String(d.nombre).trim() === '' || String(d.nombre).length > 50) {
    return 'El nombre es obligatorio (máximo 50 caracteres)';
  }
  if (vacio(d.apellidos) || String(d.apellidos).trim() === '' || String(d.apellidos).length > 100) {
    return 'Los apellidos son obligatorios (máximo 100 caracteres)';
  }
  if (vacio(d.correo) || !correoPermitido(d.correo)) {
    return 'El correo es obligatorio y debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres)';
  }
  if (contrasenaObligatoria || !vacio(d.contrasena)) {
    const largo = String(d.contrasena ?? '').length;
    if (largo < 4 || largo > 10) {
      return 'La contraseña debe tener entre 4 y 10 caracteres';
    }
  }
  if (!vacio(d.fecha_nacimiento)) {
    const fecha = new Date(d.fecha_nacimiento);
    if (Number.isNaN(fecha.getTime()) || fecha > new Date()) {
      return 'La fecha de nacimiento es inválida';
    }
  }
  if (vacio(d.direccion) || String(d.direccion).trim() === '' || String(d.direccion).length > 300) {
    return 'La dirección es obligatoria (máximo 300 caracteres)';
  }
  if (vacio(d.region) || vacio(d.comuna)) {
    return 'Debes seleccionar la región y la comuna';
  }
  if (!vacio(d.rol) && !['cliente', 'vendedor', 'administrador'].includes(d.rol)) {
    return 'El tipo de usuario es inválido';
  }
  return null;
}