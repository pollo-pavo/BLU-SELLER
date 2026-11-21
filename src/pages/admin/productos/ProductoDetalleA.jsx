import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { adminObtenerProducto, adminEliminarProducto } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../utils/roles';
import '../../../styles/admin/productos/ProductoDetalleA.css';

function ProductoDetalleA() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === ROLES.ADMIN;
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    adminObtenerProducto(id)
      .then((datos) => setProducto(datos))
      .catch((err) => setError(err.message));
  }, [id]);

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await adminEliminarProducto(p.id);
      navigate('/admin/productos');
    } catch (err) {
      alert(err.message);
    }
  };

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
      {esAdmin && (
        <>
          <Link to={`/admin/productos/${producto.id}/editar`} className="producto-detalle-admin-boton">Editar</Link>{' '}
          <button type="button" onClick={() => eliminar(producto)}>Eliminar</button>{' '}
        </>
      )}
      <Link to="/admin/productos">Volver</Link>
    </div>
  );
}

export default ProductoDetalleA;