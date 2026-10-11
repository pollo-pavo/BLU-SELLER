import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import TarjetaProducto from '../components/ui/TarjetaProducto';
import { obtenerCategorias, obtenerProductosPorCategoria } from '../services/api';
import '../styles/General.css';
import '../styles/Categorias.css';

function CategoriaDetalle() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setCategoria(null);

    obtenerCategorias()
      .then((datos) => {
        const encontrada = datos.find((c) => c.id === Number(id));
        if (!encontrada) throw new Error('Categoría no encontrada');
        setCategoria(encontrada);
      })
      .catch((err) => setError(err.message));

    obtenerProductosPorCategoria(id)
      .then((datos) => setProductos(datos))
      .catch((err) => console.error(err));
  }, [id]);

  if (error) {
    return (
      <>
        <HeaderGeneral />
        <div className="fondo-pagina">
          <h2 className="titulo-pagina">{error}</h2>
          <Link to="/categorias">Volver a Categorías</Link>
        </div>
      </>
    );
  }

  if (!categoria) {
    return (
      <>
        <HeaderGeneral />
        <div className="fondo-pagina"></div>
      </>
    );
  }

  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <div className="categoria-migas">
          <Link to="/">Home</Link> &gt; <Link to="/categorias">Categorías</Link> &gt; {categoria.nombre}
        </div>

        <h2 className="titulo-pagina">{categoria.nombre}</h2>

        <div className="productos-grid">
          {productos.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      </div>
    </>
  );
}

export default CategoriaDetalle;