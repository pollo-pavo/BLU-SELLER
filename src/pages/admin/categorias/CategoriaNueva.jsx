import '../../../styles/admin/categorias/CategoriaNueva.css';

function CategoriaNueva() {
  return (
    <div className="categoria-nueva">
      <h1>NUEVA CATEGORÍA</h1>

      <form className="categoria-form-caja" onSubmit={(e) => e.preventDefault()}>
        <div className="categoria-form-encabezado">Registro de categoría</div>

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" required minLength={2} maxLength={50} />

        <button type="submit">GUARDAR</button>
      </form>
    </div>
  );
}

export default CategoriaNueva;