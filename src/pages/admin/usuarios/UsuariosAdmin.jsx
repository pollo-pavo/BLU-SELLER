import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminObtenerUsuarios } from '../../../services/api';
import '../../../styles/admin/usuarios/UsuarioAdmin.css';

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    adminObtenerUsuarios()
      .then((datos) => setUsuarios(datos))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="usuarios-admin">
      <div className="usuarios-admin-encabezado">
        <h1>Usuarios</h1>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsuariosAdmin;