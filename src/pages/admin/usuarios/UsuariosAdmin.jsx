import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminObtenerUsuarios, adminEliminarUsuario } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/admin/usuarios/UsuarioAdmin.css';

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const { usuario: yo } = useAuth();

  useEffect(() => {
    adminObtenerUsuarios()
      .then((datos) => setUsuarios(datos))
      .catch((error) => console.error(error));
  }, []);

  const eliminar = async (u) => {
    if (!window.confirm(`¿Eliminar a "${u.nombre} ${u.apellidos}"?`)) return;
    try {
      await adminEliminarUsuario(u.id);
      setUsuarios((actuales) => actuales.filter((x) => x.id !== u.id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="usuarios-admin">

    <div className='usuarios-admin'>
      <h1>Usuarios</h1>
    </div>

      <div className="usuarios-admin-encabezado">
        <Link to="/admin/usuarios/nuevo" className="usuarios-admin-boton">NUEVO USUARIO</Link>
      </div>

      <table className="usuarios-admin-tabla">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre} {u.apellidos}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>
                <Link to={`/admin/usuarios/${u.id}`}>Ver</Link>{' '}
                <Link to={`/admin/usuarios/${u.id}/editar`}>Editar</Link>{' '}
                <Link to={`/admin/usuarios/${u.id}/historial`}>Historial</Link>
                {u.id !== yo?.id && (
                  <>{' '}<button type="button" onClick={() => eliminar(u)}>Eliminar</button></>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsuariosAdmin;