import { Link } from 'react-router-dom';
import { ordenes } from '../../../data/ordenes';
import '../../../styles/admin/ordenes/OrdenesAdmin.css';

function OrdenesAdmin() {
  return (
    <div className="ordenes-admin">
      <div className="ordenes-admin-encabezado">
        <h1>Órdenes</h1>
      </div>

      <table className="ordenes-admin-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Orden #</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Boleta</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.id}>
              <td>{o.fecha_creacion}</td>
              <td>#{o.id}</td>
              <td>{o.nombre_cliente}</td>
              <td><span className={`estado estado-${o.estado}`}>{o.estado}</span></td>
              <td>${o.total.toLocaleString('es-CL')}</td>
              <td><Link to={`/admin/ordenes/${o.id}`}>Ver boleta</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdenesAdmin;