import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/InicioSesion.css';
import '../styles/General.css';
import { PATRON_CORREO, TEXTO_CORREO } from '../utils/validaciones';
import { ROLES } from '../utils/roles';

const destinoPorRol = (rol) => {
  if (rol === ROLES.ADMIN) return '/admin/dashboard';
  if (rol === ROLES.VENDEDOR) return '/admin/ordenes';
  return '/';
};


function InicioSesion() {

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion, iniciarSesionGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const usuario = await iniciarSesion(correo, contraseña);
      navigate(destinoPorRol(usuario.rol));
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  const entrarConGoogle = async ({ credential }) => {
    setError('');
    try {
      const usuario = await iniciarSesionGoogle(credential);
      navigate(destinoPorRol(usuario.rol));
    } catch (err) {
      setError('No se pudo iniciar sesión con Google');
    }
  };


  return (
    <>
      <HeaderGeneral carrito={false} />

      <div className="contenedor">

        <div className="caja">
          
          <h1>Inicio de Sesión</h1>

          {error && <Alert variant="danger">{error}</Alert>}
        
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="texto-izquierda">Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                minLength={4}
                maxLength={100}
                pattern={PATRON_CORREO}
                title={TEXTO_CORREO}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="texto-izquierda">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Ingresar
            </Button>

            <div className="registro-link">
              <Link to="/registro">¿No tienes una cuenta? Regístrate</Link>
            </div>
          </Form>

          <div className="d-flex justify-content-center mt-3">
            <GoogleLogin
              onSuccess={entrarConGoogle}
              onError={() => setError('No se pudo iniciar sesión con Google')}
            />
          </div>
          
        </div>
      </div>
    </>  

  );
}

export default InicioSesion;