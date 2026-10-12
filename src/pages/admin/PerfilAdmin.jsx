import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminObtenerUsuario } from '../../services/api';
import '../../styles/admin/usuarios/UsuarioDetalle.css';

function PerfilAdmin() {
  const { usuario } = useAuth();
  const [u, setU] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminObtenerUsuario(usuario.id)
      .then((datos) => setU(datos))
      .catch((err) => setError(err.message));
  }, [usuario.id]);

  if (error) return <p>{error}</p>;
  if (!u) return <p>Cargando...</p>;

  return (
    <div className="usuario-detalle">
      <h1>Mi perfil</h1>
      <dl>
        <dt>Nombre</dt><dd>{u.nombre} {u.apellidos}</dd>
        <dt>RUN</dt><dd>{u.run}</dd>
        <dt>Correo</dt><dd>{u.correo}</dd>
        <dt>Teléfono</dt><dd>{u.telefono || 'No registrado'}</dd>
        <dt>Fecha de nacimiento</dt><dd>{u.fecha_nacimiento || 'No registrada'}</dd>
        <dt>Dirección</dt><dd>{u.direccion}</dd>
        <dt>Región</dt><dd>{u.region}</dd>
        <dt>Comuna</dt><dd>{u.comuna}</dd>
        <dt>Rol</dt><dd>{u.rol}</dd>
      </dl>
      <Link to={`/admin/usuarios/${u.id}/editar`} className="usuario-detalle-boton">Editar mis datos</Link>
    </div>
  );
}

export default PerfilAdmin;