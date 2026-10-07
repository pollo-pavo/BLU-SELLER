import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/Registro.css';
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
        <h1>NOMBRE EMPRESA</h1>
      </div>

      <div className="contenedor">

        <div className="caja">
          
          <h1>Registro de usuario</h1>
        
          <Form>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label className='texto-izquierda'>Nombre Completo</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su correo electrónico" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label className='texto-izquierda'>Correo</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su correo" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contraseña">
              <Form.Label className='texto-izquierda'>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su contraseña" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmarContraseña">
              <Form.Label className='texto-izquierda'>Confirmar contraseña</Form.Label>
              <Form.Control type="password" placeholder="Confirme su contraseña" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label className='texto-izquierda'>Telefono(Opcional)</Form.Label>
              <Form.Control type="tel" placeholder="Ingrese su numero de telefono" />
            </Form.Group>
            
            
            <Button variant="primary" type="submit">
              Registarte
            </Button>

        
         
          </Form> 
          
        </div>
      </div>
    </>  

  );
}

export default InicioSesion;