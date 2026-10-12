import { useState, useEffect } from 'react';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import TarjetaProducto from '../components/ui/TarjetaProducto';
import { obtenerOfertas } from '../services/api';
import '../styles/General.css';
import '../styles/Productos.css';

function Ofertas() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerOfertas()
      .then((datos) => setProductos(datos))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <h2 className="titulo-pagina">OFERTAS</h2>

        {productos.length === 0 ? (
          <p className='texto-pagina'>No hay productos en oferta por ahora.</p>
        ) : (
          <div className="productos-grid">
            {productos.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Ofertas;