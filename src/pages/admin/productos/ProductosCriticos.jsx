import { Link } from 'react-router-dom';
import { productos } from '../../../data/productos';
import '../../../styles/admin/productos/ProductosCriticos.css';

function ProductosCriticos() {
  const criticos = productos.filter((p) => p.stock <= p.stockCritico);

  return (
    <div className="productos-criticos">
      <h1>Productos críticos</h1>

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
              <td>{p.stockCritico}</td>
              <td><Link to={`/admin/productos/${p.id}/editar`}>Reponer</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosCriticos;