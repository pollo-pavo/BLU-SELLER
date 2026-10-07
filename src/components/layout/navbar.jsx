import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function BarraNavegacion() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
          <Nav className="me-auto">

            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/Productos">
              Productos
            </Nav.Link>

            <Nav.Link as={Link} to="/Contacto">
              Contacto
            </Nav.Link>

            <Nav.Link as={Link} to="/Blogs">
              Blogs
            </Nav.Link>

            <Nav.Link as={Link} to="/Nosotros">
              Nosotros
            </Nav.Link>

            <Nav.Link as={Link} to="/InicioSesion">
              Inicio de Sesión
            </Nav.Link>

            
          </Nav>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;

