import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminObtenerCriticos } from '../../../services/api';
import '../../../styles/admin/productos/ProductosCriticos.css';

function ProductosCriticos() {
  const [criticos, setCriticos] = useState([]);

  useEffect(() => {
    adminObtenerCriticos()
      .then((datos) => setCriticos(datos))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="productos-criticos">

      <div className='productos-criticos-admin'>
        <h1>Productos críticos</h1>
      </div>

      <div className="productos-admin-encabezado">
        <Link to="/admin/productos/" className="productos-admin-boton">PRODUCTOS</Link>
      </div>

      <table className="productos-criticos-tabla">
        <thead>
          <tr><th>Código</th><th>Nombre</th><th>Stock</th><th>Crítico</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {criticos.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td className={p.stock === 0 ? 'agotado' : 'bajo'}>{p.stock}</td>
              <td>{p.stock_critico}</td>
              <td><Link to={`/admin/productos/${p.id}/editar`}>Reponer</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosCriticos;