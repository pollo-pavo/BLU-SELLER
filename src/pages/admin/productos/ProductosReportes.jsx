import { productos } from '../../../data/productos';
import '../../../styles/admin/productos/ProductosReportes.css';

function ProductosReportes() {
  const total = productos.length;
  const stockTotal = productos.reduce((suma, p) => suma + p.stock, 0);
  const valorInventario = productos.reduce((suma, p) => suma + p.precio * p.stock, 0);
  const criticos = productos.filter((p) => p.stock <= p.stockCritico).length;

  return (
    <div className="productos-reportes">
      <h1>Reporte de productos</h1>

      <div className="productos-reportes-tarjetas">
        <div className="tarjeta"><span>Productos</span><strong>{total}</strong></div>
        <div className="tarjeta"><span>Unidades en stock</span><strong>{stockTotal}</strong></div>
        <div className="tarjeta"><span>Valor del inventario</span><strong>${valorInventario.toLocaleString('es-CL')}</strong></div>
        <div className="tarjeta"><span>En estado crítico</span><strong>{criticos}</strong></div>
      </div>
    </div>
  );
}

export default ProductosReportes;