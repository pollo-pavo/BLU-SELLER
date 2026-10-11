import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminObtenerProductos } from '../../../services/api';
import '../../../styles/admin/productos/ProductosAdmin.css';

function ProductosAdmin() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    adminObtenerProductos()
      .then((datos) => setProductos(datos))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="productos-admin">
      <div className="productos-admin-encabezado">
        <h1>Productos</h1>
        <Link to="/admin/productos/nuevo" className="productos-admin-boton">NUEVO PRODUCTO</Link>
        <Link to="/admin/productos/criticos" className="productos-admin-boton claro">CRÍTICOS</Link>
        <Link to="/admin/productos/reportes" className="productos-admin-boton claro">REPORTES</Link>
      </div>

      <table className="productos-admin-tabla">
        <thead>
          <tr>
            <th>Código</th><th>Nombre</th><th>Categoría</th>
            <th>Precio</th><th>Stock</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria ?? '-'}</td>
              <td>${Number(p.precio).toLocaleString('es-CL')}</td>
              <td>{p.stock}</td>
              <td>
                <Link to={`/admin/productos/${p.id}`}>Ver</Link>{' '}
                <Link to={`/admin/productos/${p.id}/editar`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosAdmin;