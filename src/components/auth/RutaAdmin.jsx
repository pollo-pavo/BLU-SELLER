import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RutaAdmin({ children }) {
    const { usuario } = useAuth();

    if (!usuario) return <Navigate to="/InicioSesion"  replace/>;
    if (usuario.rol !== "admin") return <Navigate to="/"  replace/>;

    return children;
}

export default RutaAdmin;