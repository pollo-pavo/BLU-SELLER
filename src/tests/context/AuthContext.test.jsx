import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('inicia sesión guardando el usuario (con el rol "administrador" convertido a "admin") y lo borra al cerrar sesión', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 21,
          nombre: 'Ana',
          apellidos: 'Pérez',
          correo: 'ana@correo.cl',
          direccion: 'Av. Siempre Viva 742',
          region: 'Metropolitana',
          comuna: 'Providencia',
          rol: 'administrador',
          token: 'dato-que-no-se-guarda',
        }),
      })
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.usuario).toBeNull();

    await act(async () => {
      await result.current.iniciarSesion('ana@correo.cl', 'clave123');
    });

    expect(fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'ana@correo.cl', contrasena: 'clave123' }),
    });

    const esperado = {
      id: 21,
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@correo.cl',
      direccion: 'Av. Siempre Viva 742',
      region: 'Metropolitana',
      comuna: 'Providencia',
      rol: 'admin',
    };
    expect(result.current.usuario).toEqual(esperado);
    expect(JSON.parse(localStorage.getItem('usuario'))).toEqual(esperado);

    act(() => {
      result.current.logout();
    });

    expect(result.current.usuario).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
  });
});