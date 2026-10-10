import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';
import '../styles/ProductoDetalle.css';
import { useCarrito } from '../context/CarritoContext';
import { obtenerProducto, obtenerProductos } from '../services/api';

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [error, setError] = useState('');
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    setError('');
    setProducto(null);

    obtenerProducto(id)
      .then((datos) => setProducto(datos))
      .catch((err) => setError(err.message));

    obtenerProductos()
      .then((datos) =>
        setRelacionados(datos.filter((p) => p.id !== Number(id)).slice(0, 5))
      )
      .catch((err) => console.error(err));
  }, [id]);

  if (error) {
    return (
      <>
        <HeaderGeneral />
        <div className="fondo-pagina">
          <h2 className="titulo-pagina">{error}</h2>
          <Link to="/productos">Volver a Productos</Link>
        </div>
      </>
    );
  }

  if (!producto) {
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
        <div className="detalle-migas">
          <Link to="/">Home</Link> &gt; <Link to="/productos">Productos</Link> &gt; {producto.nombre}
        </div>

        <div className="detalle-principal">
          <div className="detalle-galeria">
            <div className="detalle-imagen"></div>
            <div className="detalle-miniaturas">
              <div className="detalle-miniatura"></div>
              <div className="detalle-miniatura"></div>
              <div className="detalle-miniatura"></div>
            </div>
          </div>

          <div className="detalle-info">
            <div className="detalle-encabezado">
              <h2>{producto.nombre}</h2>
              <span className="detalle-precio">${Number(producto.precio)}</span>
            </div>

            <p className="detalle-descripcion">{producto.descripcion}</p>

            <Form.Group controlId="cantidad" className="detalle-cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Select value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" className="detalle-boton" onClick={() => agregar(producto, cantidad)}>Añadir al carrito</Button>
          </div>
        </div>

        <div className="detalle-relacionados">
          <h5>Productos relacionados</h5>
          <div className="relacionados-grid">
            {relacionados.map((p) => (
              <Link to={`/productos/${p.id}`} className="relacionado-card" key={p.id}>
                <div className="relacionado-imagen"></div>
                <span>{p.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductoDetalle;