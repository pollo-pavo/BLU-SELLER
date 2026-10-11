import { Link, useParams } from 'react-router-dom';
import { ordenes } from '../../../data/ordenes';
import { ordenItems } from '../../../data/ordenItems';
import { productos } from '../../../data/productos';
import '../../../styles/admin/ordenes/BoletaAdmin.css';

function BoletaAdmin() {
  const { id } = useParams();
  const orden = ordenes.find((o) => o.id === Number(id));

  if (!orden) return <p>Orden no encontrada</p>;

  const items = ordenItems
    .filter((i) => i.orden_id === orden.id)
    .map((i) => ({
      ...i,
      nombre: productos.find((p) => p.id === i.producto_id)?.nombre ?? 'Producto eliminado',
      subtotal: i.cantidad * i.precio_unitario,
    }));

  const total = items.reduce((suma, i) => suma + i.subtotal, 0);

  return (
    <div className="boleta-admin">
      <h1>Boleta #{orden.id}</h1>

      <section className="boleta-admin-caja">
        <div className="boleta-admin-datos">
          <p><strong>Fecha:</strong> {orden.fecha_creacion}</p>
          <p><strong>Estado:</strong> {orden.estado}</p>
          <p><strong>Cliente:</strong> {orden.nombre_cliente}</p>
          <p><strong>Correo:</strong> {orden.correo_cliente}</p>
          <p><strong>Teléfono:</strong> {orden.telefono || 'No registrado'}</p>
          <p><strong>Dirección:</strong> {orden.direccion}, {orden.comuna}, {orden.region}</p>
        </div>

        <table className="boleta-admin-tabla">
          <thead>
            <tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
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