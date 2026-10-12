import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminObtenerUsuario } from '../../../services/api';
import '../../../styles/admin/usuarios/UsuarioDetalle.css';

function UsuarioDetalle() {
  const { id } = useParams();
  const [u, setU] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    adminObtenerUsuario(id)
      .then((datos) => setU(datos))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!u) return <p>Cargando...</p>;

  return (
    <div className="usuario-detalle">
      <h1>{u.nombre} {u.apellidos}</h1>
      <dl>
        <dt>RUN</dt><dd>{u.run}</dd>
        <dt>Correo</dt><dd>{u.correo}</dd>
        <dt>Teléfono</dt><dd>{u.telefono || 'No registrado'}</dd>
        <dt>Fecha de nacimiento</dt><dd>{u.fecha_nacimiento || 'No registrada'}</dd>
        <dt>Dirección</dt><dd>{u.direccion}</dd>
        <dt>Región</dt><dd>{u.region}</dd>
        <dt>Comuna</dt><dd>{u.comuna}</dd>
        <dt>Rol</dt><dd>{u.rol}</dd>
        <dt>Creado el</dt><dd>{new Date(u.fecha_creacion).toLocaleDateString('es-CL')}</dd>
      </dl>
      <Link to={`/admin/usuarios/${u.id}/editar`} className="usuario-detalle-boton">Editar</Link>{' '}
      <Link to={`/admin/usuarios/${u.id}/historial`}>Historial de compras</Link>{' '}
      <Link to="/admin/usuarios">Volver</Link>
    </div>
  );
}

export default UsuarioDetalle;