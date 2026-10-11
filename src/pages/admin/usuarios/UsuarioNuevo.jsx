import { regiones } from '../../../data/regiones';
import '../../../styles/admin/usuarios/UsuarioNuevo.css';

function UsuarioNuevo() {
  const comunas = regiones.flatMap((r) => r.comunas);

  return (
    <div className="usuario-nuevo">
      <h1>NUEVO USUARIO</h1>

      <form className="usuario-form-caja" onSubmit={(e) => e.preventDefault()}>
        <div className="usuario-form-encabezado">Registro de usuario</div>

        <label htmlFor="nombre">NOMBRE COMPLETO</label>
        <input id="nombre" type="text" required maxLength={150} />

        <label htmlFor="correo">CORREO</label>
        <input id="correo" type="email" required maxLength={100} />

        <label htmlFor="correo2">CONFIRMAR CORREO</label>
        <input id="correo2" type="email" required maxLength={100} />

        <label htmlFor="clave">CONTRASEÑA</label>
        <input id="clave" type="password" required minLength={6} maxLength={100} />

        <label htmlFor="clave2">CONFIRMAR CONTRASEÑA</label>
        <input id="clave2" type="password" required minLength={6} maxLength={100} />

        <label htmlFor="telefono">TELÉFONO (opcional)</label>
        <input id="telefono" type="tel" maxLength={20} />

        <label htmlFor="rol">ROL</label>
        <select id="rol" defaultValue="cliente" required>
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
          <option value="administrador">Administrador</option>
        </select>

        <div className="usuario-form-selects">
          <select defaultValue="" required>
            <option value="" disabled>-- Seleccione la región --</option>
            {regiones.map((r) => (
              <option key={r.nombre}>{r.nombre}</option>
            ))}
          </select>

          <select defaultValue="" required>
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