import '../../../styles/admin/productos/ProductoNuevo.css';

function ProductoNuevo() {
  return (
    <div className="producto-nuevo">
      <h1>NUEVO PRODUCTO</h1>

      <form className="producto-form-caja" onSubmit={(e) => e.preventDefault()}>
        <div className="producto-form-encabezado">Registro de producto</div>

        <label htmlFor="codigo">CÓDIGO</label>
        <input id="codigo" type="text" required minLength={3} />

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" required maxLength={100} />

        <label htmlFor="descripcion">DESCRIPCIÓN</label>
        <textarea id="descripcion" rows="3" maxLength={500} />

        <label htmlFor="precio">PRECIO</label>
        <input id="precio" type="number" min="0" required />

        <label htmlFor="stock">STOCK</label>
        <input id="stock" type="number" min="0" required />

        <label htmlFor="critico">STOCK CRÍTICO</label>
        <input id="critico" type="number" min="0" required />

        <label htmlFor="categoria">CATEGORÍA</label>
        <select id="categoria" defaultValue="" required>
          <option value="" disabled>-- Seleccione la categoría --</option>
          <option>Categoría 1</option>
          <option>Categoría 2</option>
        </select>

        <button type="submit">GUARDAR</button>
      </form>
    </div>
  );
}

export default ProductoNuevo;