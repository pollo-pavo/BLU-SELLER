import Button from 'react-bootstrap/Button';
import '../styles/General.css';
import '../styles/Productos.css';

const productos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto ${i + 1}`,
  precio: 1000,
}));

function Productos() {
  return (
    <>
      <div className="productos-header">
        <div className="productos-marca">
          <img src="/imagenes/logo.png" alt="Logo" className="logo" />
          <h1>NOMBRE EMPRESA</h1>
        </div>
        <span className="productos-carrito">Carrito (0)</span>
      </div>

      <div className="productos-fondo">
        <h2 className="productos-titulo">PRODUCTOS</h2>

        <div className="productos-grid">
          {productos.map((p) => (
            <div className="producto-card" key={p.id}>
              <div className="producto-imagen"></div>
              <span className="producto-nombre">{p.nombre}</span>
              <span className="producto-precio">${p.precio}</span>
              <Button size="sm" variant="light">Añadir</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Productos;