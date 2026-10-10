import { useCarrito } from '../../context/CarritoContext';
import '../../styles/General.css';

function HeaderGeneral({ carrito = true }) {
  const { cantidadTotal } = useCarrito();

  return (
    <div className="header-general">
      <div className="header-marca">
        <img src="/imagenes/logo.png" alt="Logo" className="logo" />
        <h1>BLU-SELLER</h1>
      </div>
      {carrito && <span className="header-carrito">Carrito ({cantidadTotal})</span>}
    </div>
  );
}

export default HeaderGeneral;