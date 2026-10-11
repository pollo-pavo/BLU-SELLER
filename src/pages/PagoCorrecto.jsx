import { Container } from 'react-bootstrap';
import ResumenCompra from '../components/ui/ResumenCompra';
import { compraEjemplo } from '../data/compraEjemplo';
import '../styles/PagoCorrecto.css';

function PagoCorrecto() {
  return (
    <Container className="pago-correcto">
      <section className="pago-correcto-tarjeta">
        <p className="pago-correcto-codigo">Código orden: {compraEjemplo.codigoOrden}</p>

        <h1>
          <span className="pago-correcto-icono">✓</span>
          Se ha realizado la compra. nro #{compraEjemplo.nro}
        </h1>
        <p className="pago-correcto-ayuda">Completa la siguiente información</p>

        <ResumenCompra compra={compraEjemplo} />

        <div className="pago-correcto-botones">
          <button type="button" className="pago-correcto-pdf">Imprimir boleta en PDF</button>
          <button type="button" className="pago-correcto-email">Enviar boleta por email</button>
        </div>
      </section>
    </Container>
  );
}

export default PagoCorrecto;