import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { leerSesion, guardarSesion, borrarSesion, onSesionExpirada, login, leer } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null);
  const [cargando, setCargando] = useState(() => Boolean(leerSesion()?.token));

  const logout = useCallback(() => {
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

  const iniciarSesion = async (correo, contrasena) => {
    const d = await login(correo, contrasena);
    guardarSesion({ token: d.token, refreshToken: d.refreshToken, usuario: d.usuario });
    setUsuario(d.usuario);
    return d.usuario;
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);