import { Link, useParams } from 'react-router-dom';
import { usuarios } from '../../../data/usuarios';
import { ordenes } from '../../../data/ordenes';
import '../../../styles/admin/usuarios/UsuarioHistorial.css';

const compras = [
  { id: 1001, usuario_id: 2, fecha: '2024-06-12', estado: 'Enviada', total: 21980 },
  { id: 1002, usuario_id: 2, fecha: '2024-06-20', estado: 'Pendiente', total: 8990 },
  { id: 1003, usuario_id: 1, fecha: '2024-06-15', estado: 'Enviada', total: 4500 },
];

function UsuarioHistorial() {
  const { id } = useParams();
  const u = usuarios.find((x) => x.id === Number(id));

  if (!u) return <p>Usuario no encontrado</p>;

  const misCompras = ordenes.filter((o) => o.usuario_id === u.id);

  return (
    <div className="usuario-historial">
      <h1>Historial de compras: {u.nombre}</h1>

      {misCompras.length === 0 ? (
        <p>Este usuario aún no tiene compras.</p>
      ) : (
        <table className="usuario-historial-tabla">
          <thead>
            <tr><th>Orden</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Boleta</th></tr>
          </thead>
          <tbody>
            {misCompras.map((c) => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td>{c.fecha}</td>
                <td>{c.estado}</td>
                <td>${c.total.toLocaleString('es-CL')}</td>
                <td><Link to={`/admin/ordenes/${c.id}`}>Ver boleta</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to={`/admin/usuarios/${u.id}`}>Volver</Link>
    </div>
  );
}

export default UsuarioHistorial;