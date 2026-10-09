import { Navigate,Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RutaAdmin() {
    const { usuario } = useAuth();

    if (!usuario) return <Navigate to="/InicioSesion"  replace/>;
    if (usuario.rol !== "admin") return <Navigate to="/"  replace/>;

    return <Outlet />;
}

export default RutaAdmin;