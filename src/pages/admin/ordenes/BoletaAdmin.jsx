import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerOrden } from '../../../services/api';
import '../../../styles/admin/ordenes/BoletaAdmin.css';

function BoletaAdmin() {
  const { id } = useParams();
  const [orden, setOrden] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    obtenerOrden(id)
      .then((datos) => setOrden(datos))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!orden) return <p>Cargando...</p>;

  const items = orden.items.map((i) => ({
    ...i,
    precio_unitario: Number(i.precio_unitario),
    subtotal: i.cantidad * Number(i.precio_unitario),
  }));

  const total = Number(orden.total);
  const direccion = [
    orden.calle,
    orden.departamento && `depto ${orden.departamento}`,
    orden.comuna,
    orden.region,
  ].filter(Boolean).join(', ');

  return (
    <div className="boleta-admin">
      <h1>Boleta #{orden.id}</h1>

      <section className="boleta-admin-caja">
        <div className="boleta-admin-datos">
          <p><strong>Fecha:</strong> {new Date(orden.fecha_creacion).toLocaleDateString('es-CL')}</p>
          <p><strong>Estado:</strong> {orden.estado}</p>
          <p><strong>Cliente:</strong> {orden.nombre} {orden.apellidos}</p>
          <p><strong>Correo:</strong> {orden.correo}</p>
          <p><strong>Dirección:</strong> {direccion}</p>
          {orden.indicaciones && <p><strong>Indicaciones:</strong> {orden.indicaciones}</p>}
        </div>

        <table className="boleta-admin-tabla">
          <thead>
            <tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {items.map((i, indice) => (
              <tr key={indice}>
                <td>{i.nombre}</td>
                <td>{i.cantidad}</td>
                <td>${i.precio_unitario.toLocaleString('es-CL')}</td>
                <td>${i.subtotal.toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Total</strong></td>
              <td><strong>${total.toLocaleString('es-CL')}</strong></td>
            </tr>
          </tfoot>
        </table>
      </section>

      <Link to="/admin/ordenes">Volver a órdenes</Link>
    </div>
  );
}

export default BoletaAdmin;