import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/InicioSesion.css';
import '../styles/General.css';
import { Link } from "react-router-dom";


function InicioSesion() {
  return (
    <>
      <div>
        <img 
        src="/imagenes/logo.png" 
        alt="Logo"
        className="logo"
      />
        <h1>BLU-SELLER</h1>
      </div>

      <div className="contenedor">

        <div className="caja">
          
          <h1>Inicio de Sesión</h1>
        
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className='texto-izquierda'>Correo</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su correo electrónico" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className='texto-izquierda'>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su contraseña" />
              </Form.Group>
            <Button variant="primary" type="submit">
              Ingresar
            </Button>

            <div className="registro-link">
              <Link to="/Registro">
                ¿No tienes una cuenta? Regístrate
              </Link>
            
            </div>
          </Form> 
          
        </div>
      </div>
    </>  

  );
}

export default InicioSesion;