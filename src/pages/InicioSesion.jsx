import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/InicioSesion.css';


function InicioSesion() {
  return (
    <div className="contenedor">
      <div className="caja">
        <h1>Inicio de Sesión</h1>
      
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control type="email" placeholder="Ingrese su correo electrónico" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Ingrese su contraseña" />
            </Form.Group>
          <Button variant="primary" type="submit">
            Ingresar
          </Button>
        </Form> 
        
      </div>
    </div>
  );
}

export default InicioSesion;