import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminObtenerUsuario, adminObtenerHistorial } from '../../../services/api';
import '../../../styles/admin/usuarios/UsuarioHistorial.css';

function UsuarioHistorial() {
  const { id } = useParams();
  const [u, setU] = useState(null);
  const [compras, setCompras] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    adminObtenerUsuario(id)
      .then((datos) => setU(datos))
      .catch((err) => setError(err.message));

    adminObtenerHistorial(id)
      .then((datos) => setCompras(datos))
      .catch((err) => console.error(err));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!u) return <p>Cargando...</p>;

  return (
    <div className="usuario-historial">
      <h1>Historial de compras: {u.nombre} {u.apellidos}</h1>

      {compras.length === 0 ? (
        <p>Este usuario aún no tiene compras.</p>
      ) : (
        <table className="usuario-historial-tabla">
          <thead>
            <tr><th>Orden</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Boleta</th></tr>
          </thead>
          <tbody>
            {compras.map((c) => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td>{new Date(c.fecha_creacion).toLocaleDateString('es-CL')}</td>
                <td>{c.estado}</td>
                <td>${Number(c.total).toLocaleString('es-CL')}</td>
                <td><Link to={`/admin/ordenes/${c.id}`}>Ver boleta</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className='acciones'>
        <Link to={`/admin/usuarios/${u.id}`}>Ver usuario</Link>
        <Link to="/admin/usuarios">Volver</Link>
      </div>

    </div>
  );
}

export default UsuarioHistorial;