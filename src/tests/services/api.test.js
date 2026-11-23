import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { leer, onSesionExpirada } from '../../services/api';

const resp = (cuerpo, status = 200) => ({ ok: status < 400, status, json: async () => cuerpo });

describe('api', () => {
  beforeEach(() => localStorage.setItem('sesion', JSON.stringify({ token: 'viejo', refreshToken: 'r1', usuario: {} })));
  afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); });

  it('agrega Authorization a cada petición', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resp([])));
    await leer('/productos');
    expect(fetch).toHaveBeenCalledWith('/api/v1/productos', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer viejo' }),
    }));
  });

  it('ante un 401 renueva el token y reintenta la petición', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(resp({}, 401))
      .mockResolvedValueOnce(resp({ token: 'nuevo' }))
      .mockResolvedValueOnce(resp({ ok: true })));

    expect(await leer('/admin/productos')).toEqual({ ok: true });
    expect(fetch).toHaveBeenNthCalledWith(2, '/api/v1/auth/refresh', expect.objectContaining({ method: 'POST' }));
    expect(fetch).toHaveBeenNthCalledWith(3, '/api/v1/admin/productos', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer nuevo' }),
    }));
    expect(JSON.parse(localStorage.getItem('sesion')).token).toBe('nuevo');
  });

  it('si la renovación falla, avisa que la sesión expiró', async () => {
    const expirar = vi.fn();
    onSesionExpirada(expirar);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resp({}, 401)));

    await expect(leer('/admin/productos')).rejects.toThrow('Tu sesión expiró');
    expect(expirar).toHaveBeenCalled();
  });
});