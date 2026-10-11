import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminObtenerProducto } from '../../../services/api';
import '../../../styles/admin/productos/ProductoDetalleA.css';

function ProductoDetalleA() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    adminObtenerProducto(id)
      .then((datos) => setProducto(datos))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="producto-detalle-admin">
      <h1>{producto.nombre}</h1>
      <dl>
        <dt>Código</dt><dd>{producto.codigo}</dd>
        <dt>Categoría</dt><dd>{producto.categoria ?? '-'}</dd>
        <dt>Precio</dt><dd>${Number(producto.precio).toLocaleString('es-CL')}</dd>
        {producto.precio_oferta !== null && (
          <>
            <dt>Precio oferta</dt>
            <dd>${Number(producto.precio_oferta).toLocaleString('es-CL')}</dd>
          </>
        )}
        <dt>Stock</dt><dd>{producto.stock}</dd>
        <dt>Stock crítico</dt><dd>{producto.stock_critico}</dd>
        <dt>Descripción</dt><dd>{producto.descripcion}</dd>
      </dl>
      <Link to={`/admin/productos/${producto.id}/editar`} className="producto-detalle-admin-boton">Editar</Link>{' '}
      <Link to="/admin/productos">Volver</Link>
    </div>
  );
}

export default ProductoDetalleA;