import { useState, useEffect } from 'react';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import TarjetaProducto from '../components/ui/TarjetaProducto';
import { obtenerProductos } from '../services/api';
import '../styles/General.css';
import '../styles/Productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);

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
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Productos;