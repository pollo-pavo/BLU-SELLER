import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminObtenerOrdenes } from '../../../services/api';
import '../../../styles/admin/ordenes/OrdenesAdmin.css';

function OrdenesAdmin() {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    adminObtenerOrdenes()
      .then((datos) => setOrdenes(datos))
      .catch((error) => console.error(error));
  }, []);

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
              <td>{new Date(o.fecha_creacion).toLocaleDateString('es-CL')}</td>
              <td>#{o.id}</td>
              <td>{o.cliente}</td>
              <td><span className={`estado estado-${o.estado}`}>{o.estado}</span></td>
              <td>${Number(o.total).toLocaleString('es-CL')}</td>
              <td><Link to={`/admin/ordenes/${o.id}`}>Ver boleta</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdenesAdmin;