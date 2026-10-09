import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function PanelAdmin() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const cerrarSesion = () => {
        logout();
        navigate('/InicioSesion');
    };

    return (
        <Container className="mt-4">
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {usuario.correo}</p>
            <Button variant="danger" onClick={cerrarSesion}>
                Cerrar Sesión
            </Button>
        </Container>
    );
}

export default PanelAdmin;