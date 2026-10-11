import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import TarjetaProducto from '../components/ui/TarjetaProducto';
import { obtenerProductos } from '../services/api';
import '../styles/General.css';
import '../styles/Productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [parametros] = useSearchParams();
  const buscar = parametros.get('buscar') || '';

  useEffect(() => {
    obtenerProductos(buscar)
      .then((datos) => setProductos(datos))
      .catch((error) => console.error(error));
  }, [buscar]);

  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <h2 className="titulo-pagina">
          {buscar ? `RESULTADOS PARA "${buscar}"` : 'PRODUCTOS'}
        </h2>

        {productos.length === 0 ? (
          <p>No se encontraron productos.</p>
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

export default Productos;