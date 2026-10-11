import { useParams } from 'react-router-dom';
import { categorias } from '../../../data/categorias';
import '../../../styles/admin/categorias/CategoriaEditar.css';

function CategoriaEditar() {
  const { id } = useParams();
  const c = categorias.find((x) => x.id === Number(id));

  if (!c) return <p>Categoría no encontrada</p>;

  return (
    <div className="categoria-editar">
      <h1>EDITAR CATEGORÍA</h1>

      <form className="categoria-editar-caja" onSubmit={(e) => e.preventDefault()}>
        <div className="categoria-editar-encabezado">Editar categoría #{c.id}</div>

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" defaultValue={c.nombre} required minLength={2} maxLength={50} />

        <button type="submit">ACTUALIZAR</button>
      </form>
    </div>
  );
}

export default CategoriaEditar;