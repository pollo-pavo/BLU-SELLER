import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import TarjetaProducto from '../components/ui/TarjetaProducto';
import { obtenerCategorias, obtenerProductos } from '../services/api';
import '../styles/General.css';
import '../styles/Categorias.css';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerCategorias()
      .then((datos) => setCategorias(datos))
      .catch((error) => console.error(error));

    obtenerProductos()
      .then((datos) => setProductos(datos))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <h2 className="titulo-pagina">CATEGORÍAS</h2>

        <div className="categorias-lista">
          {categorias.map((c) => (
            <Link to={`/categorias/${c.id}`} className="categoria-card" key={c.id}>
              <div className="categoria-imagen"></div>
              <span>{c.nombre}</span>
            </Link>
          ))}
        </div>

        {categorias.map((c) => (
          <section className="categoria-seccion" key={c.id}>
            <h3>{c.nombre}</h3>
            <div className="productos-grid">
              {productos
                .filter((p) => p.categoria_id === c.id)
                .map((p) => (
                  <TarjetaProducto key={p.id} producto={p} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default Categorias;