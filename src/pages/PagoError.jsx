import { Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ResumenCompra from '../components/ui/ResumenCompra';
import '../styles/PagoError.css';

function PagoError() {
  const { state } = useLocation();
  const compra = state?.compra;
  const mensaje = state?.mensaje;

  return (
    <Container className="pago-error">
      <section className="pago-error-tarjeta">
        <h1>
          <span className="pago-error-icono">✕</span>
          No se pudo realizar el pago.
        </h1>
        <p className="pago-error-ayuda">{mensaje ?? 'Detalle de compra'}</p>

        <div className="pago-error-reintento">
          <Link to="/checkout" className="pago-error-boton">VOLVER A REALIZAR EL PAGO</Link>
        </div>

        {compra && <ResumenCompra compra={compra} />}
      </section>
    </Container>
  );
}

export default PagoError;