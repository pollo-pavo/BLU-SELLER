import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SelectorUbicacion from '../components/forms/selectorUbicacion.jsx';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/Registro.css';
import '../styles/General.css';
import { validarRun, PATRON_CORREO, TEXTO_CORREO } from '../utils/validaciones';




function registro() {
    const navigate = useNavigate();
  const [ubicacion, setUbicacion] = useState({ region: null, comuna: null });

  const enviar = async (e) => {
    e.preventDefault();
    const campos = e.target.elements;

    if (!validarRun(campos.run.value)) {
      alert('El RUN es inválido (sin puntos ni guion, con dígito verificador correcto)');
      return;
    }
    if (campos.contrasena.value !== campos.confirmarContrasena.value) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!ubicacion.region || !ubicacion.comuna) {
      alert('Debes seleccionar la región y la comuna');
      return;
    }

    const respuesta = await fetch('/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
        run: campos.run.value,
        nombre: campos.nombre.value,
        apellidos: campos.apellidos.value,
        correo: campos.correo.value,
        contrasena: campos.contrasena.value,
        fecha_nacimiento: campos.fechaNacimiento.value,
        telefono: campos.telefono.value,
        direccion: campos.direccion.value,
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
            <Form.Group className="mb-3" controlId="run">
              <Form.Label className='texto-izquierda'>RUN</Form.Label>
              <Form.Control type="text" placeholder="Sin puntos ni guion, ej: 123456785" required minLength={7} maxLength={9} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label className='texto-izquierda'>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su nombre" required maxLength={50} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="apellidos">
              <Form.Label className='texto-izquierda'>Apellidos</Form.Label>
              <Form.Control type="text" placeholder="Ingrese sus apellidos" required maxLength={100} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label className='texto-izquierda'>Correo</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su correo" required maxLength={100} pattern={PATRON_CORREO} title={TEXTO_CORREO} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contrasena">
              <Form.Label className='texto-izquierda'>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su contraseña" required minLength={4} maxLength={10} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmarContrasena">
              <Form.Label className='texto-izquierda'>Confirmar contraseña</Form.Label>
              <Form.Control type="password" placeholder="Confirme su contraseña" required minLength={4} maxLength={10} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label className='texto-izquierda'>Telefono(Opcional)</Form.Label>
              <Form.Control type="tel" placeholder="Ingrese su numero de telefono" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fechaNacimiento">
              <Form.Label className='texto-izquierda'>Fecha de nacimiento (Opcional)</Form.Label>
              <Form.Control type="date" />
            </Form.Group>

            <SelectorUbicacion onCambio={setUbicacion} />

            <Form.Group className="mb-3" controlId="direccion">
              <Form.Label className='texto-izquierda'>Dirección</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su dirección" required maxLength={300} />
            </Form.Group>
            
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