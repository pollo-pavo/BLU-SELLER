import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import '../styles/General.css'

const CarritoContext = createContext(null);

const CLAVE_INVITADO = 'carrito';
const claveDe = (usuario) => (usuario ? `carrito_${usuario.id}` : CLAVE_INVITADO);

const leer = (clave) => {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};

const fusionar = (base, extra) => {
  const mapa = new Map(base.map((i) => [i.id, { ...i }]));
  for (const i of extra) {
    const existente = mapa.get(i.id);
    if (existente) existente.cantidad += i.cantidad;
    else mapa.set(i.id, { ...i });
  }
  return [...mapa.values()];
};

export function CarritoProvider({ children }) {
  const usuario = useAuth()?.usuario ?? null;
  const clave = claveDe(usuario);

  const [claveActual, setClaveActual] = useState(clave);
  const [items, setItems] = useState(() =>
    usuario ? fusionar(leer(clave), leer(CLAVE_INVITADO)) : leer(clave)
  );

  if (clave !== claveActual) {
    setClaveActual(clave);
    const propios = leer(clave);
    setItems(claveActual === CLAVE_INVITADO ? fusionar(propios, items) : propios);
  }

  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(items));
  }, [clave, items]);

  useEffect(() => {
    if (usuario) localStorage.removeItem(CLAVE_INVITADO);
  }, [usuario]);

  const agregar = (producto, cantidad = 1) => {
    setItems((actuales) => {
      const existente = actuales.find((i) => i.id === producto.id);
      if (existente) {
        return actuales.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [
        ...actuales,
        { id: producto.id, nombre: producto.nombre, precio: Number(producto.precio_oferta ?? producto.precio), cantidad },
      ];
    });
  };

  const quitar = (id) => setItems((actuales) => actuales.filter((i) => i.id !== id));

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setItems((actuales) =>
      actuales.map((i) => (i.id === id ? { ...i, cantidad } : i))
    );
  };

  const vaciar = () => setItems([]);

  const cantidadTotal = items.reduce((total, i) => total + i.cantidad, 0);
  const totalPrecio = items.reduce((total, i) => total + i.precio * i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar, cantidadTotal, totalPrecio }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);