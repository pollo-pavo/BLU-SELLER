import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import TarjetaProducto from '../components/ui/TarjetaProducto';
import { useCarrito } from '../context/CarritoContext';
import { obtenerProductos } from '../services/api';
import '../styles/General.css';
import '../styles/Productos.css';
import '../styles/Carrito.css';

function Carrito() {
  const { items, cambiarCantidad, quitar, vaciar, totalPrecio } = useCarrito();
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
        <div className="carrito-contenido">
          <div className="carrito-productos">
            <h4 className='texto-pagina'>Lista de productos</h4>
            <div className="productos-grid">
              {productos.map((p) => (
                <TarjetaProducto key={p.id} producto={p} />
              ))}
            </div>
          </div>

          <div className="carrito-compras">
            <h4 className='texto-pagina'>Carrito de Compras</h4>

            {items.length === 0 ? (
              <p className='texto-pagina'>El carrito está vacío.</p>
            ) : (
              <>
                <table className="carrito-tabla">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i) => (
                      <tr key={i.id}>
                        <td><div className="carrito-miniatura"></div></td>
                        <td>{i.nombre}</td>
                        <td>${i.precio.toLocaleString('es-CL')}</td>
                        <td>
                          <Button size="sm" variant="outline-secondary" onClick={() => cambiarCantidad(i.id, i.cantidad - 1)}>-</Button>
                          {' '}{i.cantidad}{' '}
                          <Button size="sm" variant="outline-secondary" onClick={() => cambiarCantidad(i.id, i.cantidad + 1)}>+</Button>
                        </td>
                        <td>${(i.precio * i.cantidad).toLocaleString('es-CL')}</td>
                        <td>
                          <Button size="sm" variant="danger" onClick={() => quitar(i.id)}>Eliminar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="carrito-total">Total: ${totalPrecio.toLocaleString('es-CL')}</p>

                <div className="carrito-botones">
                  <Button variant="secondary" onClick={vaciar}>Limpiar</Button>
                  <Button as={Link} to="/checkout" variant="success">Comprar ahora</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Carrito;