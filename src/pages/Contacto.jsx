import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../styles/Contacto.css';
import '../styles/General.css';

function Contacto() {
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
        <div className='caja'>

          <h1>Formulario de contacto</h1>

          <Form>

            <Form.Group className="mb-3" controlId="nombreCompleto">
              <Form.Label className='texto-izquierda'>Nombre completo</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su nombre completo" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className='texto-izquierda'>Correo</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su correo" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contenido">
              <Form.Label className='texto-izquierda'>Contenido</Form.Label>
              < Form.Control as="textarea" rows={10} placeholder="Escriba su mensaje aquí..."/>
            </Form.Group>

            <Button variant="primary" type="submit" className='mt-3'>
              ENVIAR
            </Button>

          </Form>

          </div>
      </div>


    </>
  );
}

export default Contacto;