import {createContext, useState, useContext} from 'react';

const AuthContext = createContext(null);

const usuarioPrueba = [
    { correo: "admin@gmail.com", contraseña: "admin123", rol: "admin" },
    { correo: "cliente@gmail.com", contraseña: "cliente123", rol: "cliente" },
];

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuario');
        return guardado ? JSON.parse(guardado) : null;
    });

    const iniciarSesion = async (correo, contraseña) => {
        const encontrado = usuarioPrueba.find(
            (u) => u.correo === correo && u.contraseña === contraseña
    );

    if (!encontrado) throw new Error('Correo o contraseña incorrectos');
    
    const data = { correo: encontrado.correo, rol: encontrado.rol };
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