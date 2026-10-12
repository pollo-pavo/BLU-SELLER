import { useNavigate } from 'react-router-dom';
import { regiones } from '../../../data/regiones';
import { adminCrearUsuario } from '../../../services/api';
import '../../../styles/admin/usuarios/UsuarioNuevo.css';
import { validarRun, PATRON_CORREO, TEXTO_CORREO } from '../../../utils/validaciones';

function UsuarioNuevo() {
  const navigate = useNavigate();
  const comunas = regiones.flatMap((r) => r.comunas);

  const guardar = async (e) => {
    e.preventDefault();
    const c = e.target.elements;

    if (!validarRun(c.run.value)) {
      window.alert('El RUN es inválido (sin puntos ni guion, con dígito verificador correcto)');
      return;
    }

    if (c.correo.value !== c.correo2.value) {
      window.alert('Los correos no coinciden');
      return;
    }
    if (c.clave.value !== c.clave2.value) {
      window.alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await adminCrearUsuario({
        run: c.run.value,
        nombre: c.nombre.value,
        apellidos: c.apellidos.value,
        correo: c.correo.value,
        contrasena: c.clave.value,
        fecha_nacimiento: c.fechaNacimiento.value,
        telefono: c.telefono.value,
        direccion: c.direccion.value,
        rol: c.rol.value,
        region: c.region.value,
        comuna: c.comuna.value,
      });
      window.alert('Usuario creado correctamente');
      navigate('/admin/usuarios');
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <div className="usuario-nuevo">
      <h1>NUEVO USUARIO</h1>

      <form className="usuario-form-caja" onSubmit={guardar}>
        <div className="usuario-form-encabezado">Registro de usuario</div>

        <label htmlFor="run">RUN</label>
        <input id="run" type="text" required minLength={7} maxLength={9} placeholder="Sin puntos ni guion, ej: 123456785" />

        <label htmlFor="nombre">NOMBRE</label>
        <input id="correo" type="email" required maxLength={100} pattern={PATRON_CORREO} title={TEXTO_CORREO} />

        <label htmlFor="apellidos">APELLIDOS</label>
        <input id="correo2" type="email" required maxLength={100} pattern={PATRON_CORREO} title={TEXTO_CORREO} />

        <label htmlFor="correo">CORREO</label>
        <input id="correo" type="email" required maxLength={100} />

        <label htmlFor="correo2">CONFIRMAR CORREO</label>
        <input id="correo2" type="email" required maxLength={100} />

        <label htmlFor="clave">CONTRASEÑA</label>
        <input id="clave" type="password" required minLength={4} maxLength={10} />

        <label htmlFor="clave2">CONFIRMAR CONTRASEÑA</label>
        <input id="clave2" type="password" required minLength={4} maxLength={10} />

        <label htmlFor="fechaNacimiento">FECHA DE NACIMIENTO (opcional)</label>
        <input id="fechaNacimiento" type="date" />

        <label htmlFor="telefono">TELÉFONO (opcional)</label>
        <input id="telefono" type="tel" maxLength={20} />

        <label htmlFor="direccion">DIRECCIÓN</label>
        <input id="direccion" type="text" required maxLength={300} />

        <label htmlFor="rol">TIPO DE USUARIO</label>
        <select id="rol" defaultValue="cliente" required>
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
          <option value="administrador">Administrador</option>
        </select>

        <div className="usuario-form-selects">
          <select id="region" defaultValue="" required>
            <option value="" disabled>-- Seleccione la región --</option>
            {regiones.map((r) => (
              <option key={r.nombre}>{r.nombre}</option>
            ))}
          </select>

          <select id="comuna" defaultValue="" required>
            <option value="" disabled>-- Seleccione la comuna --</option>
            {comunas.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button type="submit">REGISTRAR</button>
      </form>
    </div>
  );
}

export default UsuarioNuevo;