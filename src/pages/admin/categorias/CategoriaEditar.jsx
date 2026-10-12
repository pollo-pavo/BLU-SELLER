import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { adminObtenerCategoria, adminActualizarCategoria } from '../../../services/api';
import '../../../styles/admin/categorias/CategoriaEditar.css';

function CategoriaEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    adminObtenerCategoria(id)
      .then((datos) => setCategoria(datos))
      .catch((err) => setError(err.message));
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();

    try {
      await adminActualizarCategoria(id, { nombre: e.target.elements.nombre.value });
      window.alert('Categoría actualizada correctamente');
      navigate('/admin/categorias');
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!categoria) return <p>Cargando...</p>;

  return (
    <div className="categoria-editar">
      <h1>EDITAR CATEGORÍA</h1>

      <form className="categoria-editar-caja" onSubmit={guardar}>
        <div className="categoria-editar-encabezado">Editar categoría #{categoria.id}</div>

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" defaultValue={categoria.nombre} required minLength={2} maxLength={50} />

        <button type="submit">ACTUALIZAR</button>
        <Link to="/admin/categorias">Volver</Link>

      </form>
    </div>
  );
}

export default CategoriaEditar;