import { Link, useParams } from 'react-router-dom';
import { productos } from '../../../data/productos';
import '../../../styles/admin/productos/ProductoDetalleA.css';

function ProductoDetalleA() {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === Number(id));

  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <div className="producto-detalle-admin">
      <h1>{producto.nombre}</h1>
      <dl>
        <dt>Código</dt><dd>{producto.codigo}</dd>
        <dt>Categoría</dt><dd>{producto.categoria}</dd>
        <dt>Precio</dt><dd>${producto.precio.toLocaleString('es-CL')}</dd>
        <dt>Stock</dt><dd>{producto.stock}</dd>
        <dt>Stock crítico</dt><dd>{producto.stockCritico}</dd>
        <dt>Descripción</dt><dd>{producto.descripcion}</dd>
      </dl>
      <Link to={`/admin/productos/${producto.id}/editar`} className="producto-detalle-admin-boton">Editar</Link>{' '}
      <Link to="/admin/productos">Volver</Link>
    </div>
  );
}

export default ProductoDetalleA;