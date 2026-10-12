import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { regiones } from '../../../data/regiones';
import { adminObtenerUsuario, adminActualizarUsuario } from '../../../services/api';
import '../../../styles/admin/usuarios/UsuarioEditar.css';
import { Link } from 'react-router-dom';
import { validarRun, PATRON_CORREO, TEXTO_CORREO } from '../../../utils/validaciones';

function UsuarioEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [u, setU] = useState(null);
  const [error, setError] = useState('');
  const comunas = regiones.flatMap((r) => r.comunas);

  useEffect(() => {
    setError('');
    adminObtenerUsuario(id)
      .then((datos) => setU(datos))
      .catch((err) => setError(err.message));
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();
    const c = e.target.elements;

    if (!validarRun(c.run.value)) {
      window.alert('El RUN es inválido (sin puntos ni guion, con dígito verificador correcto)');
      return;
    }

    try {
      await adminActualizarUsuario(id, {
        run: c.run.value,
        nombre: c.nombre.value,
        apellidos: c.apellidos.value,
        correo: c.correo.value,
        fecha_nacimiento: c.fechaNacimiento.value,
        telefono: c.telefono.value,
        direccion: c.direccion.value,
        rol: c.rol.value,
        region: c.region.value,
        comuna: c.comuna.value,
      });
      window.alert('Usuario actualizado correctamente');
      navigate('/admin/usuarios');
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!u) return <p>Cargando...</p>;

  return (
    <div className="usuario-editar">
      <h1>EDITAR USUARIO</h1>

      <form className="usuario-editar-caja" onSubmit={guardar}>
        <div className="usuario-editar-encabezado">Editar usuario #{u.id}</div>

        <label htmlFor="run">RUN</label>
        <input id="run" type="text" defaultValue={u.run} required minLength={7} maxLength={9} />

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" defaultValue={u.nombre} required maxLength={100} />

        <label htmlFor="apellidos">APELLIDOS</label>
        <input id="apellidos" type="text" defaultValue={u.apellidos} required maxLength={100} />

        <label htmlFor="correo">CORREO</label>
        <input id="correo" type="email" defaultValue={u.correo} required maxLength={100} />

        <label htmlFor="fechaNacimiento">FECHA DE NACIMIENTO (opcional)</label>
        <input id="fechaNacimiento" type="date" defaultValue={u.fecha_nacimiento ?? ''} />

        <label htmlFor="telefono">TELÉFONO (opcional)</label>
        <input id="telefono" type="tel" defaultValue={u.telefono ?? ''} maxLength={20} />

        <label htmlFor="direccion">DIRECCIÓN</label>
        <input id="direccion" type="text" defaultValue={u.direccion} required maxLength={300} />

        <label htmlFor="rol">TIPO DE USUARIO</label>
        <select id="rol" defaultValue={u.rol} required>
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
          <option value="administrador">Administrador</option>
        </select>

        <div className="usuario-editar-selects">
          <select id="region" defaultValue={u.region ?? ''} required>
            <option value="" disabled>-- Seleccione la región --</option>
            {regiones.map((r) => (
              <option key={r.nombre}>{r.nombre}</option>
            ))}
          </select>

          <select id="comuna" defaultValue={u.comuna ?? ''} required>
            <option value="" disabled>-- Seleccione la comuna --</option>
            {comunas.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button type="submit">ACTUALIZAR</button>
        <Link to="/admin/usuarios">Volver</Link>
      </form>
    </div>
  );
}

export default UsuarioEditar;