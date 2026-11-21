import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';

function RutaProtegida({ roles }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;
  if (!usuario) return <Navigate to="/InicioSesion" replace />;
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={usuario.rol === ROLES.VENDEDOR ? '/admin/ordenes' : '/'} replace />;
  }
  return <Outlet />;
}

export default RutaProtegida;