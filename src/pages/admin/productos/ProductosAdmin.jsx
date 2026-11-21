import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/admin/productos/ProductosAdmin.css';
import { adminObtenerProductos, adminEliminarProducto } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../utils/roles';

function ProductosAdmin() {
  const [productos, setProductos] = useState([]);

  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === ROLES.ADMIN;

  useEffect(() => {
    adminObtenerProductos()
      .then((datos) => setProductos(datos))
      .catch((error) => console.error(error));
  }, []);

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await adminEliminarProducto(p.id);
      setProductos((actuales) => actuales.filter((x) => x.id !== p.id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="productos-admin">

      <div className='productos-admin'>
        <h1>Productos</h1>
      </div>  

      <div className="productos-admin-encabezado">
        {esAdmin && (
          <>
            <Link to="/admin/productos/nuevo" className="productos-admin-boton">NUEVO PRODUCTO</Link>
            <Link to="/admin/productos/criticos" className="productos-admin-boton claro">CRÍTICOS</Link>
            <Link to="/admin/productos/reportes" className="productos-admin-boton claro">REPORTES</Link>
          </>
        )}
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
                <Link to={`/admin/productos/${p.id}`}>Ver</Link>
                {esAdmin && (
                  <>
                    {' '}<Link to={`/admin/productos/${p.id}/editar`}>Editar</Link>
                    {' '}<button type="button" onClick={() => eliminar(p)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosAdmin;