import {createContext, useState, useContext} from 'react';

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuario');
        return guardado ? JSON.parse(guardado) : null;
    });

    const iniciarSesion = async (correo, contraseña) => {
        const respuesta = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena: contraseña }),
        });

        if (!respuesta.ok) throw new Error('Correo o contraseña incorrectos');

        const datos = await respuesta.json();
        const data = {
            id: datos.id,
            nombre: datos.nombre,
            correo: datos.correo,
            rol: datos.rol === 'administrador' ? 'admin' : datos.rol,
        };
        setUsuario(data);
        localStorage.setItem('usuario', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('usuario');
    }

    return (
        <AuthContext.Provider value={{ usuario, iniciarSesion, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);