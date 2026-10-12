import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { adminCrearCategoria } from '../../../services/api';
import '../../../styles/admin/categorias/CategoriaNueva.css';

function CategoriaNueva() {
  const navigate = useNavigate();

  const guardar = async (e) => {
    e.preventDefault();

    try {
      await adminCrearCategoria({ nombre: e.target.elements.nombre.value });
      window.alert('Categoría creada correctamente');
      navigate('/admin/categorias');
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <div className="categoria-nueva">
      <h1>NUEVA CATEGORÍA</h1>

      <form className="categoria-form-caja" onSubmit={guardar}>
        <div className="categoria-form-encabezado">Registro de categoría</div>

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" required minLength={2} maxLength={50} />

        <button type="submit">GUARDAR</button>
        <Link to="/admin/categorias">Volver</Link>
      </form>
    </div>
  );
}

export default CategoriaNueva;