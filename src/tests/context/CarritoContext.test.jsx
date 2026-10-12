import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CarritoProvider, useCarrito } from '../../context/CarritoContext';

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('agrega, actualiza y quita productos, calcula los totales y guarda el carrito en localStorage', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: CarritoProvider });

    expect(result.current.items).toEqual([]);
    expect(result.current.cantidadTotal).toBe(0);
    expect(result.current.totalPrecio).toBe(0);

    act(() => {
      result.current.agregar({
        id: 1,
        nombre: 'Zapatillas Runner',
        precio: '25000',
        precio_oferta: '19990',
      });
    });
    expect(result.current.items).toEqual([
      { id: 1, nombre: 'Zapatillas Runner', precio: 19990, cantidad: 1 },
    ]);

    act(() => {
      result.current.agregar({ id: 1, nombre: 'Zapatillas Runner', precio: '25000', precio_oferta: '19990' }, 2);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(3);

    act(() => {
      result.current.agregar({ id: 2, nombre: 'Mochila Urbana', precio: '15000', precio_oferta: null });
    });
    expect(result.current.items[1]).toEqual({
      id: 2,
      nombre: 'Mochila Urbana',
      precio: 15000,
      cantidad: 1,
    });

    expect(result.current.cantidadTotal).toBe(4);
    expect(result.current.totalPrecio).toBe(74970);

    act(() => {
      result.current.cambiarCantidad(2, 2);
    });
    expect(result.current.items[1].cantidad).toBe(2);
    expect(result.current.cantidadTotal).toBe(5);
    expect(result.current.totalPrecio).toBe(89970);

    act(() => {
      result.current.cambiarCantidad(2, 0);
    });
    expect(result.current.items[1].cantidad).toBe(2);

    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual(result.current.items);

    act(() => {
      result.current.quitar(1);
    });
    expect(result.current.items).toEqual([
      { id: 2, nombre: 'Mochila Urbana', precio: 15000, cantidad: 2 },
    ]);
    act(() => {
      result.current.vaciar();
    });
    expect(result.current.items).toEqual([]);
    expect(result.current.cantidadTotal).toBe(0);
    expect(result.current.totalPrecio).toBe(0);
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([]);
  });
});