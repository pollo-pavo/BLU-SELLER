import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { leerSesion, guardarSesion, borrarSesion, onSesionExpirada, login, loginGoogle, leer } from '../services/api';
import { googleLogout } from '@react-oauth/google';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null);
  const [cargando, setCargando] = useState(() => Boolean(leerSesion()?.token));

  const logout = useCallback(() => {
  googleLogout();
  borrarSesion();
  setUsuario(null);
}, []);

  useEffect(() => { onSesionExpirada(logout); }, [logout]);

  // Rehidratar: validar el token guardado contra /auth/me. Si no sirve, cerrar sesión.
  useEffect(() => {
    if (!leerSesion()?.token) return;
    let activo = true;
    leer('/auth/me')
      .then((u) => {
        if (!activo) return;
        guardarSesion({ ...leerSesion(), usuario: u });
        setUsuario(u);
      })
      .catch(() => { if (activo) logout(); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [logout]);

  const abrirSesion = (d) => {
    guardarSesion({ token: d.token, refreshToken: d.refreshToken, usuario: d.usuario });
    setUsuario(d.usuario);
    return d.usuario;
  };

  const iniciarSesion = async (correo, contrasena) =>
    abrirSesion(await login(correo, contrasena));

  const iniciarSesionGoogle = async (credential) =>
    abrirSesion(await loginGoogle(credential));

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, iniciarSesionGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);