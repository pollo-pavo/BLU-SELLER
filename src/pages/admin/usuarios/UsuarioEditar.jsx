import { useParams } from 'react-router-dom';
import { usuarios } from '../../../data/usuarios';
import { regiones } from '../../../data/regiones';
import '../../../styles/admin/usuarios/UsuarioEditar.css';

function UsuarioEditar() {
  const { id } = useParams();
  const u = usuarios.find((x) => x.id === Number(id));

  if (!u) return <p>Usuario no encontrado</p>;

  const comunas = regiones.flatMap((r) => r.comunas);

  return (
    <div className="usuario-editar">
      <h1>EDITAR USUARIO</h1>

      <form className="usuario-editar-caja" onSubmit={(e) => e.preventDefault()}>
        <div className="usuario-editar-encabezado">Editar usuario #{u.id}</div>

        <label htmlFor="nombre">NOMBRE COMPLETO</label>
        <input id="nombre" type="text" defaultValue={u.nombre} required maxLength={150} />

        <label htmlFor="correo">CORREO</label>
        <input id="correo" type="email" defaultValue={u.correo} required maxLength={100} />

        <label htmlFor="telefono">TELÉFONO (opcional)</label>
        <input id="telefono" type="tel" defaultValue={u.telefono} maxLength={20} />

        <label htmlFor="rol">ROL</label>
        <select id="rol" defaultValue={u.rol} required>
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
          <option value="administrador">Administrador</option>
        </select>

        <div className="usuario-editar-selects">
          <select defaultValue={u.region} required>
            {regiones.map((r) => (
              <option key={r.nombre}>{r.nombre}</option>
            ))}
          </select>

          <select defaultValue={u.comuna} required>
            {comunas.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button type="submit">ACTUALIZAR</button>
      </form>
    </div>
  );
}

export default UsuarioEditar;