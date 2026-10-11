import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ResumenCompra from '../components/ui/ResumenCompra';
import { obtenerOrden } from '../services/api';
import '../styles/PagoCorrecto.css';

function PagoCorrecto() {
  const [parametros] = useSearchParams();
  const ordenId = parametros.get('orden');
  const [compra, setCompra] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ordenId) return;

    obtenerOrden(ordenId)
      .then((orden) =>
        setCompra({
          nro: orden.id,
          codigoOrden: `ORDER${String(orden.id).padStart(5, '0')}`,
          nombre: orden.nombre,
          apellidos: orden.apellidos,
          correo: orden.correo,
          calle: orden.calle,
          departamento: orden.departamento ?? '',
          region: orden.region,
          comuna: orden.comuna,
          indicaciones: orden.indicaciones ?? '',
          items: orden.items.map((i, indice) => ({
            id: i.producto_id ?? indice,
            nombre: i.nombre,
            precio: Number(i.precio_unitario),
            cantidad: i.cantidad,
          })),
        })
      )
      .catch((err) => setError(err.message));
  }, [ordenId]);

  if (!ordenId) {
    return <Container className="pago-correcto"><p>No hay una compra para mostrar.</p></Container>;
  }
  if (error) {
    return <Container className="pago-correcto"><p>{error}</p></Container>;
  }
  if (!compra) {
    return <Container className="pago-correcto"><p>Cargando...</p></Container>;
  }

  return (
    <Container className="pago-correcto">
      <section className="pago-correcto-tarjeta">
        <p className="pago-correcto-codigo">Código orden: {compra.codigoOrden}</p>

        <h1>
          <span className="pago-correcto-icono">✓</span>
          Se ha realizado la compra. nro #{compra.nro}
        </h1>
        <p className="pago-correcto-ayuda">Completa la siguiente información</p>

        <ResumenCompra compra={compra} />

        <div className="pago-correcto-botones">
          <button type="button" className="pago-correcto-pdf">Imprimir boleta en PDF</button>
          <button type="button" className="pago-correcto-email">Enviar boleta por email</button>
        </div>
      </section>
    </Container>
  );
}

export default PagoCorrecto;