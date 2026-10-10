import { useParams } from 'react-router-dom';
import { productos } from '../../../data/productos';
import '../../../styles/admin/productos/ProductoEditar.css';

function ProductoEditar() {
  const { id } = useParams();
  const p = productos.find((x) => x.id === Number(id));

  if (!p) return <p>Producto no encontrado</p>;

  return (
    <div className="producto-editar">
      <h1>EDITAR PRODUCTO</h1>

      <form className="producto-editar-caja" onSubmit={(e) => e.preventDefault()}>
        <div className="producto-editar-encabezado">Editar producto {p.codigo}</div>

        <label htmlFor="codigo">CÓDIGO</label>
        <input id="codigo" type="text" defaultValue={p.codigo} readOnly />

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" defaultValue={p.nombre} required maxLength={100} />

        <label htmlFor="descripcion">DESCRIPCIÓN</label>
        <textarea id="descripcion" rows="3" defaultValue={p.descripcion} maxLength={500} />

        <label htmlFor="precio">PRECIO</label>
        <input id="precio" type="number" min="0" defaultValue={p.precio} required />

        <label htmlFor="stock">STOCK</label>
        <input id="stock" type="number" min="0" defaultValue={p.stock} required />

        <label htmlFor="critico">STOCK CRÍTICO</label>
        <input id="critico" type="number" min="0" defaultValue={p.stockCritico} required />

        <label htmlFor="categoria">CATEGORÍA</label>
        <select id="categoria" defaultValue={p.categoria}>
          <option>Categoría 1</option>
          <option>Categoría 2</option>
        </select>

        <button type="submit">ACTUALIZAR</button>
      </form>
    </div>
  );
}

export default ProductoEditar;