import { ordenes } from '../../data/ordenes';
import { ordenItems } from '../../data/ordenItems';
import { productos } from '../../data/productos';
import { usuarios } from '../../data/usuarios';
import '../../styles/admin/ReportesAdmin.css';

const estados = ['pendiente', 'pagada', 'enviada', 'entregada', 'cancelada', 'pago_fallido'];

function ReportesAdmin() {
  
  const ordenesValidas = ordenes.filter(
    (o) => o.estado !== 'cancelada' && o.estado !== 'pago_fallido'
  );

  const totalVentas = ordenesValidas.reduce((suma, o) => suma + o.total, 0);
  const ticketPromedio = ordenesValidas.length
    ? Math.round(totalVentas / ordenesValidas.length)
    : 0;
  const clientes = usuarios.filter((u) => u.rol === 'cliente').length;

  const porEstado = estados.map((e) => ({
    estado: e,
    cantidad: ordenes.filter((o) => o.estado === e).length,
  }));

  const idsValidos = ordenesValidas.map((o) => o.id);
  const masVendidos = productos
    .map((p) => {
      const unidades = ordenItems
        .filter((i) => i.producto_id === p.id && idsValidos.includes(i.orden_id))
        .reduce((suma, i) => suma + i.cantidad, 0);
      return { id: p.id, nombre: p.nombre, unidades };
    })
    .filter((p) => p.unidades > 0)
    .sort((a, b) => b.unidades - a.unidades);

  return (
    <div className="reportes-admin">
      <h1>Reportes</h1>

      <div className="reportes-admin-tarjetas">
        <div className="tarjeta"><span>Ventas totales</span><strong>${totalVentas.toLocaleString('es-CL')}</strong></div>
        <div className="tarjeta"><span>Órdenes</span><strong>{ordenes.length}</strong></div>
        <div className="tarjeta"><span>Ticket promedio</span><strong>${ticketPromedio.toLocaleString('es-CL')}</strong></div>
        <div className="tarjeta"><span>Clientes</span><strong>{clientes}</strong></div>
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