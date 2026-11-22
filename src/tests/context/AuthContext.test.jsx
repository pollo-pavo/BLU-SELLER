import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

const resp = (cuerpo, status = 200) => ({ ok: status < 400, status, json: async () => cuerpo });
const ana = { id: 21, nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.cl', rol: 'administrador' };

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('inicia sesión guardando token y usuario (rol sin renombrar) y los borra al cerrar sesión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resp({ token: 't1', refreshToken: 'r1', usuario: ana })));
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => { await result.current.iniciarSesion('ana@correo.cl', 'clave123'); });

    expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ correo: 'ana@correo.cl', contrasena: 'clave123' }),
    }));
    expect(result.current.usuario).toEqual(ana);
    expect(JSON.parse(localStorage.getItem('sesion'))).toEqual({ token: 't1', refreshToken: 'r1', usuario: ana });

    act(() => result.current.logout());
    expect(result.current.usuario).toBeNull();
    expect(localStorage.getItem('sesion')).toBeNull();
  });

  it('rehidrata la sesión al recargar validando el token con /auth/me', async () => {
    localStorage.setItem('sesion', JSON.stringify({ token: 't1', refreshToken: 'r1', usuario: null }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resp(ana)));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.cargando).toBe(true);
    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(fetch).toHaveBeenCalledWith('/api/auth/me', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer t1' }),
    }));
    expect(result.current.usuario).toEqual(ana);
  });

  it('cierra la sesión si el token no sirve y no se puede renovar', async () => {
    localStorage.setItem('sesion', JSON.stringify({ token: 'malo', refreshToken: 'malo', usuario: ana }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resp({ error: 'no' }, 401)));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.usuario).toBeNull();
    expect(localStorage.getItem('sesion')).toBeNull();
  });
});