import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table } from 'react-bootstrap';
import { obtenerMisOrdenes } from '../services/api';

function MisPedidos() {
  const [ordenes, setOrdenes] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerMisOrdenes()
      .then(setOrdenes)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <Container className="mis-pedidos my-4">
      <h1>Mis pedidos</h1>

      {error && <p role="alert">{error}</p>}
      {!error && ordenes === null && <p>Cargando...</p>}

      {ordenes?.length === 0 && (
        <p>
          Aún no tienes compras. <Link to="/productos">Ver productos</Link>
        </p>
      )}

      {ordenes?.length > 0 && (
        <Table responsive size="sm">
          <thead>
            <tr><th>Orden #</th><th>Fecha</th><th>Productos</th><th>Estado</th><th>Total</th></tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{new Date(o.fecha_creacion).toLocaleDateString('es-CL')}</td>
                <td>{o.items.map((i) => `${i.cantidad} × ${i.nombre}`).join(', ')}</td>
                <td>{o.estado}</td>
                <td>${Number(o.total).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MisPedidos;
