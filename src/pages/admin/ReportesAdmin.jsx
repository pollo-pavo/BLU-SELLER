import { useState, useEffect } from 'react';
import { adminObtenerReportes } from '../../services/api';
import '../../styles/admin/ReportesAdmin.css';

function ReportesAdmin() {
  const [reporte, setReporte] = useState(null);

  useEffect(() => {
    adminObtenerReportes()
      .then((respuesta) => setReporte(respuesta))
      .catch((error) => console.error(error));
  }, []);

  if (!reporte) return <p>Cargando...</p>;

  const porEstado = reporte.por_estado;
  const masVendidos = reporte.mas_vendidos;

  return (
    <div className="reportes-admin">
      <h1>Reportes</h1>

      <div className="reportes-admin-tarjetas">
        <div className="tarjeta"><span>Ventas totales</span><strong>${reporte.ventas_totales.toLocaleString('es-CL')}</strong></div>
        <div className="tarjeta"><span>Órdenes</span><strong>{reporte.ordenes}</strong></div>
        <div className="tarjeta"><span>Ticket promedio</span><strong>${reporte.ticket_promedio.toLocaleString('es-CL')}</strong></div>
        <div className="tarjeta"><span>Clientes</span><strong>{reporte.clientes}</strong></div>
      </div>

      <div className="reportes-admin-bloques">
        <section className="reportes-admin-bloque">
          <h2>Órdenes por estado</h2>
          <table className="reportes-admin-tabla">
            <thead>
              <tr><th>Estado</th><th>Cantidad</th></tr>
            </thead>
            <tbody>
              {porEstado.map((e) => (
                <tr key={e.estado}>
                  <td>{e.estado}</td>
                  <td>{e.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="reportes-admin-bloque">
          <h2>Productos más vendidos</h2>
          <table className="reportes-admin-tabla">
            <thead>
              <tr><th>Producto</th><th>Unidades</th></tr>
            </thead>
            <tbody>
              {masVendidos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.unidades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default ReportesAdmin;