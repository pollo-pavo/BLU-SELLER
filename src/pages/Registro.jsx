import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SelectorUbicacion from '../components/forms/selectorUbicacion.jsx';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/Registro.css';
import '../styles/General.css';




function registro() {
    const navigate = useNavigate();
  const [ubicacion, setUbicacion] = useState({ region: null, comuna: null });

  const enviar = async (e) => {
    e.preventDefault();
    const campos = e.target.elements;

    const respuesta = await fetch('/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: campos.nombre.value,
        correo: campos.correo.value,
        contrasena: campos.contrasena.value,
        telefono: campos.telefono.value,
        region: ubicacion.region,
        comuna: ubicacion.comuna,
      }),
    });
    const datos = await respuesta.json();

    if (respuesta.ok) {
      navigate('/InicioSesion');
    } else {
      alert(datos.error);
    }
  };

  return (
    <>
      <HeaderGeneral carrito={false} />

      <div className="contenedor">

        <div className="caja">
          
          <h1>Registro de usuario</h1>
        
          <Form onSubmit={enviar}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label className='texto-izquierda'>Nombre Completo</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su nombre completo" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label className='texto-izquierda'>Correo</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su correo" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contrasena">
              <Form.Label className='texto-izquierda'>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su contraseña" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmarContrasena">
              <Form.Label className='texto-izquierda'>Confirmar contraseña</Form.Label>
              <Form.Control type="password" placeholder="Confirme su contraseña" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label className='texto-izquierda'>Telefono(Opcional)</Form.Label>
              <Form.Control type="tel" placeholder="Ingrese su numero de telefono" />
            </Form.Group>

            <SelectorUbicacion onCambio={setUbicacion} />
            
            <Button variant="primary" type="submit" className='mt-3'>
              Regístrate
            </Button>
         
          </Form> 
          
        </div>
      </div>
    </>  

  );
}

export default registro;