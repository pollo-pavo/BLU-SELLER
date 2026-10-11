import { createContext, useState, useEffect, useContext } from 'react';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

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