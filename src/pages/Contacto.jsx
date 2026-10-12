import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../styles/Contacto.css';
import '../styles/General.css';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import { PATRON_CORREO, TEXTO_CORREO } from '../utils/validaciones';

function Contacto() {

  const enviar = async (e) => {
    e.preventDefault();
    const formulario = e.target;
    const campos = formulario.elements;

    const respuesta = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: campos.nombreCompleto.value,
        correo: campos['exampleForm.ControlInput1'].value,
        contenido: campos.contenido.value,
      }),
    });
    const datos = await respuesta.json();

    if (respuesta.ok) {
      alert('Mensaje enviado correctamente');
      formulario.reset();
    } else {
      alert(datos.error);
    }
  };

  return (
    <>
      <HeaderGeneral carrito={false} />


      <div className="contenedor">
        <div className='caja'>

          <h1>Formulario de contacto</h1>

          <Form onSubmit={enviar}>

            <Form.Group className="mb-3" controlId="nombreCompleto">
              <Form.Label className='texto-izquierda'>Nombre completo</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su nombre completo" required maxLength={100} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className='texto-izquierda'>Correo</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su correo" required maxLength={100} pattern={PATRON_CORREO} title={TEXTO_CORREO} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contenido">
              <Form.Label className='texto-izquierda'>Contenido</Form.Label>
              <Form.Control as="textarea" rows={10} placeholder="Escriba su mensaje aquí..." required maxLength={500} />
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