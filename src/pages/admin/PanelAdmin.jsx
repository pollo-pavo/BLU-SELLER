import { Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';


function PanelAdmin() {

    const { usuario } = useAuth();

    return (
        
        <Container className="mt-4">
            <h1>Panel de Administración holaaa</h1>
            <p>Bienvenido, {usuario.correo}</p>
        </Container>
    );
}

export default PanelAdmin;