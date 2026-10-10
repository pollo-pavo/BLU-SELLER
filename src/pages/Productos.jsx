import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';
import '../styles/Productos.css';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { obtenerProductos } from '../services/api';

function Productos() {
  const [productos, setProductos] = useState([]);

  const { agregar } = useCarrito();

  useEffect(() => {
    obtenerProductos()
      .then((datos) => setProductos(datos))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <h2 className="titulo-pagina">PRODUCTOS</h2>

        <div className="productos-grid">
          {productos.map((p) => (
            <div className="producto-card" key={p.id}>
              <Link to={`/productos/${p.id}`} className="producto-imagen"></Link>
              <Link to={`/productos/${p.id}`} className="producto-nombre">{p.nombre}</Link>
              <span className="producto-precio">${Number(p.precio)}</span>
              <Button size="sm" variant="light" onClick={() => agregar(p)}>Añadir</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Productos;