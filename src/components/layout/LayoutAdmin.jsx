import { Container, Nav } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';

function LayoutAdmin() {
  return (
    <Container className="mt-4">
      <Nav variant="tabs" className="mb-4">
        <Nav.Item><Nav.Link as={Link} to="/PanelAdmin">Inicio</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link as={Link} to="/ProductosAdmin">Productos</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link as={Link} to="/UsuariosAdmin">Usuarios</Nav.Link></Nav.Item>
      </Nav>
      <Outlet />
    </Container>
  );
}

export default LayoutAdmin;