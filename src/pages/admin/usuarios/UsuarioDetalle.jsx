import { Link, useParams } from 'react-router-dom';
import { usuarios } from '../../../data/usuarios';
import '../../../styles/admin/usuarios/UsuarioDetalle.css';

function UsuarioDetalle() {
  const { id } = useParams();
  const u = usuarios.find((x) => x.id === Number(id));

  if (!u) return <p>Usuario no encontrado</p>;

  return (
    <div className="usuario-detalle">
      <h1>{u.nombre}</h1>
      <dl>
        <dt>Correo</dt><dd>{u.correo}</dd>
        <dt>Teléfono</dt><dd>{u.telefono || 'No registrado'}</dd>
        <dt>Región</dt><dd>{u.region}</dd>
        <dt>Comuna</dt><dd>{u.comuna}</dd>
        <dt>Rol</dt><dd>{u.rol}</dd>
        <dt>Creado el</dt><dd>{u.fecha_creacion}</dd>
      </dl>
      <Link to={`/admin/usuarios/${u.id}/editar`} className="usuario-detalle-boton">Editar</Link>{' '}
      <Link to={`/admin/usuarios/${u.id}/historial`}>Historial de compras</Link>{' '}
      <Link to="/admin/usuarios">Volver</Link>
    </div>
  );
}

export default UsuarioDetalle;