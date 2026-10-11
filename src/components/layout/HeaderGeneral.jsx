import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useCarrito } from '../../context/CarritoContext';
import '../../styles/General.css';

function HeaderGeneral({ carrito = true }) {
  const { cantidadTotal } = useCarrito();
  const [texto, setTexto] = useState('');
  const navigate = useNavigate();

  const buscar = (e) => {
    e.preventDefault();
    const termino = texto.trim();
    navigate(termino ? `/productos?buscar=${encodeURIComponent(termino)}` : '/productos');
  };

  return (
    <div className="header-general">
      <div className="header-marca">
        <img src="/imagenes/logo.png" alt="Logo" className="logo" />
        <h1>BLU-SELLER</h1>
      </div>

      {carrito && (
        <Form className="header-buscador" onSubmit={buscar}>
          <Form.Control
            type="search"
            placeholder="Buscar"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <Button type="submit" variant="outline-secondary" size="sm">Buscar</Button>
        </Form>
      )}

      {carrito && <Link to="/carrito" className="header-carrito">Carrito ({cantidadTotal})</Link>}
    </div>
  );
}

export default HeaderGeneral;