import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useCarrito } from '../../context/CarritoContext';
import '../../styles/Productos.css';

function TarjetaProducto({ producto }) {
  const { agregar } = useCarrito();
  const enOferta = producto.precio_oferta !== null && producto.precio_oferta !== undefined;

  return (
    <div className="producto-card">
      <Link to={`/productos/${producto.id}`} className="producto-imagen"></Link>
      <Link to={`/productos/${producto.id}`} className="producto-nombre">{producto.nombre}</Link>

      {enOferta ? (
        <span className="producto-precio">
          <s className="producto-precio-antes">${Number(producto.precio)}</s>
          ${Number(producto.precio_oferta)}
        </span>
      ) : (
        <span className="producto-precio">${Number(producto.precio)}</span>
      )}

      <Button size="sm" variant="light" onClick={() => agregar(producto)}>Añadir</Button>
    </div>
  );
}

export default TarjetaProducto;