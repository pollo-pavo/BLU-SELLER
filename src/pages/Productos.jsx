import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';
import '../styles/Productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/api/productos')
      .then((respuesta) => respuesta.json())
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
              <div className="producto-imagen"></div>
              <span className="producto-nombre">{p.nombre}</span>
              <span className="producto-precio">${Number(p.precio)}</span>
              <Button size="sm" variant="light">Añadir</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Productos;