import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ResumenCompra from '../components/ui/ResumenCompra';
import { compraEjemplo } from '../data/compraEjemplo';
import '../styles/PagoError.css';

function PagoError() {
  return (
    <Container className="pago-error">
      <section className="pago-error-tarjeta">
        <h1>
          <span className="pago-error-icono">✕</span>
          No se pudo realizar el pago. nro #{compraEjemplo.nro}
        </h1>
        <p className="pago-error-ayuda">Detalle de compra</p>

        <div className="pago-error-reintento">
          <Link to="/checkout" className="pago-error-boton">VOLVER A REALIZAR EL PAGO</Link>
        </div>

        <ResumenCompra compra={compraEjemplo} />
      </section>
    </Container>
  );
}

export default PagoError;