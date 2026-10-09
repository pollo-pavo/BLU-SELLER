import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/InicioSesion.css';
import '../styles/General.css';


function InicioSesion() {

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const usuario = await iniciarSesion(correo, contraseña);
      navigate(usuario.rol === 'admin' ? '/PanelAdmin' : '/');
    } catch (err) {
      setError('Correo o contraseña incorrectos');
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
          
        </div>
      </div>
    </>  

  );
}

export default InicioSesion;