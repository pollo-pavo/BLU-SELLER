import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminObtenerDashboard } from '../../services/api';
import '../../styles/admin/PanelAdmin.css';

function PanelAdmin() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    adminObtenerDashboard()
      .then((respuesta) => setDatos(respuesta))
      .catch((error) => console.error(error));
  }, []);

  if (!datos) return <p>Cargando...</p>;

  const criticos = datos.productos_criticos;
  const ultimas = datos.ultimas_ordenes;

  return (
    <div className="panel-admin">
      <h1>¡HOLA Administrador!</h1>

      <section className="panel-admin-bloque">
        <h2>Resumen</h2>
        <div className="panel-admin-tarjetas">
          <div className="tarjeta"><span>Ventas totales</span><strong>${datos.ventas_totales.toLocaleString('es-CL')}</strong></div>
          <div className="tarjeta"><span>Órdenes</span><strong>{datos.ordenes}</strong></div>
          <div className="tarjeta"><span>Pendientes</span><strong>{datos.pendientes}</strong></div>
          <div className="tarjeta"><span>Usuarios</span><strong>{datos.usuarios}</strong></div>
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
                  <td>{o.cliente}</td>
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