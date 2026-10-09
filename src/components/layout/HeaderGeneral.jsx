import '../../styles/General.css';

function HeaderGeneral({ carrito = true }) {
  return (
    <div className="header-general">
      <div className="header-marca">
        <img src="/imagenes/logo.png" alt="Logo" className="logo" />
        <h1>BLU-SELLER</h1>
      </div>
      {carrito && <span className="header-carrito">Carrito (0)</span>}
    </div>
  );
}

export default HeaderGeneral;