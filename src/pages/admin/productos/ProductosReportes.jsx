import { useState, useEffect } from 'react';
import { adminObtenerReporteProductos } from '../../../services/api';
import '../../../styles/admin/productos/ProductosReportes.css';

function ProductosReportes() {
  const [reporte, setReporte] = useState(null);

  useEffect(() => {
    adminObtenerReporteProductos()
      .then((datos) => setReporte(datos))
      .catch((error) => console.error(error));
  }, []);

  if (!reporte) return <p>Cargando...</p>;

  return (
    <div className="productos-reportes">
      <h1>Reporte de productos</h1>

      <div className="productos-reportes-tarjetas">
        <div className="tarjeta"><span>Productos</span><strong>{reporte.total}</strong></div>
        <div className="tarjeta"><span>Unidades en stock</span><strong>{reporte.stock_total}</strong></div>
        <div className="tarjeta"><span>Valor del inventario</span><strong>${reporte.valor_inventario.toLocaleString('es-CL')}</strong></div>
        <div className="tarjeta"><span>En estado crítico</span><strong>{reporte.criticos}</strong></div>
      </div>
    </div>
  );
}

export default ProductosReportes;