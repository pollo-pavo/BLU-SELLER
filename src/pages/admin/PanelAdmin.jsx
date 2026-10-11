import { Link } from 'react-router-dom';
import { ordenes } from '../../data/ordenes';
import { productos } from '../../data/productos';
import { usuarios } from '../../data/usuarios';
import '../../styles/admin/PanelAdmin.css';

function PanelAdmin() {

  const ordenesValidas = ordenes.filter(
    (o) => o.estado !== 'cancelada' && o.estado !== 'pago_fallido'
  );
  const totalVentas = ordenesValidas.reduce((suma, o) => suma + o.total, 0);
  const pendientes = ordenes.filter((o) => o.estado === 'pendiente').length;

  const criticos = productos.filter((p) => p.stock <= p.stock_critico);

  const ultimas = [...ordenes]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 5);

  return (
    <div className="panel-admin">
      <h1>¡HOLA Administrador!</h1>

      <section className="panel-admin-bloque">
        <h2>Resumen</h2>
        <div className="panel-admin-tarjetas">
          <div className="tarjeta"><span>Ventas totales</span><strong>${totalVentas.toLocaleString('es-CL')}</strong></div>
          <div className="tarjeta"><span>Órdenes</span><strong>{ordenes.length}</strong></div>
          <div className="tarjeta"><span>Pendientes</span><strong>{pendientes}</strong></div>
          <div className="tarjeta"><span>Usuarios</span><strong>{usuarios.length}</strong></div>
          <div className="tarjeta"><span>Productos críticos</span><strong>{criticos.length}</strong></div>
        </div>
      </section>

      <div className="panel-admin-columnas">
        <section className="panel-admin-bloque">
          <h2>Últimas órdenes</h2>
          <table className="panel-admin-tabla">
            <thead>
              <tr><th>Orden</th><th>Cliente</th><th>Estado</th><th>Total</th></tr>
            </thead>
            <tbody>
              {ultimas.map((o) => (
                <tr key={o.id}>
                  <td><Link to={`/admin/ordenes/${o.id}`}>#{o.id}</Link></td>
                  <td>{o.nombre_cliente}</td>
                  <td>{o.estado}</td>
                  <td>${o.total.toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/admin/ordenes">Ver todas</Link>
        </section>

        <section className="panel-admin-bloque">
          <h2>Productos críticos</h2>
          {criticos.length === 0 ? (
            <p>No hay productos en estado crítico.</p>
          ) : (
            <table className="panel-admin-tabla">
              <thead>
                <tr><th>Producto</th><th>Stock</th><th>Crítico</th></tr>
              </thead>
              <tbody>
                {criticos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td className={p.stock === 0 ? 'agotado' : 'bajo'}>{p.stock}</td>
                    <td>{p.stock_critico}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link to="/admin/productos/criticos">Ver todos</Link>
        </section>
      </div>
    </div>
  );
}

export default PanelAdmin;