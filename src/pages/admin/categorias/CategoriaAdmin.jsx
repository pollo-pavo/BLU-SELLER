import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCategorias, adminEliminarCategoria } from '../../../services/api';
import '../../../styles/admin/categorias/CategoriaAdmin.css';

function CategoriaAdmin() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    obtenerCategorias()
      .then((datos) => setCategorias(datos))
      .catch((error) => console.error(error));
  }, []);

  const eliminar = async (c) => {
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    try {
      await adminEliminarCategoria(c.id);
      setCategorias((actuales) => actuales.filter((x) => x.id !== c.id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="categoria-admin">
      
      <div className='categoria-admin'>
        <h1>Categorías</h1>
      </div>
      
      <div className="categoria-admin-encabezado">
        <Link to="/admin/categorias/nueva" className="categoria-admin-boton">NUEVA CATEGORÍA</Link>
      </div>

      <table className="categoria-admin-tabla">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>
                <Link to={`/admin/categorias/${c.id}/editar`}>Editar</Link>{' '}
                <button type="button" onClick={() => eliminar(c)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriaAdmin;