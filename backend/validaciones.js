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