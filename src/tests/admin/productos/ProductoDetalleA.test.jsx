import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductoDetalleA from '../../../pages/admin/productos/ProductoDetalleA';
import { adminObtenerProducto, adminEliminarProducto } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../utils/roles';

vi.mock('../../../services/api', () => ({
  adminObtenerProducto: vi.fn(),
  adminEliminarProducto: vi.fn(),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const producto = {
  id: 15,
  codigo: 'ZAP-001',
  nombre: 'Zapatillas Runner',
  categoria: 'Calzado',
  precio: '25000',
  precio_oferta: '19990',
  stock: 40,
  stock_critico: 5,
  descripcion: 'Zapatillas livianas para correr',
};

const valorDe = (etiqueta) => screen.getByText(etiqueta).nextElementSibling;

const renderizar = () =>
  render(
    <MemoryRouter initialEntries={['/admin/productos/15']}>
      <Routes>
        <Route path="/admin/productos/:id" element={<ProductoDetalleA />} />
        <Route path="/admin/productos" element={<p>Listado de productos</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('ProductoDetalleA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminObtenerProducto.mockResolvedValue(producto);
  });

  it('carga el producto y muestra todos sus datos con los precios formateados y los enlaces', async () => {
    useAuth.mockReturnValue({ usuario: { rol: ROLES.ADMIN } });
    renderizar();

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Zapatillas Runner' })
    ).toBeInTheDocument();
    expect(adminObtenerProducto).toHaveBeenCalledWith('15');

    expect(valorDe('Código')).toHaveTextContent('ZAP-001');
    expect(valorDe('Categoría')).toHaveTextContent('Calzado');
    expect(valorDe('Precio')).toHaveTextContent('$25.000');
    expect(valorDe('Precio oferta')).toHaveTextContent('$19.990');
    expect(valorDe('Stock')).toHaveTextContent('40');
    expect(valorDe('Stock crítico')).toHaveTextContent('5');
    expect(valorDe('Descripción')).toHaveTextContent('Zapatillas livianas para correr');

    expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute(
      'href',
      '/admin/productos/15/editar'
    );
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute(
      'href',
      '/admin/productos'
    );
  });

  it('al vendedor le muestra los datos pero no Editar ni Eliminar', async () => {
    useAuth.mockReturnValue({ usuario: { rol: ROLES.VENDEDOR } });
    renderizar();

    expect(
      await screen.findByRole('heading', { name: 'Zapatillas Runner' })
    ).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: 'Editar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver' })).toBeInTheDocument();
  });

  it('elimina el producto al confirmar y vuelve al listado', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ usuario: { rol: ROLES.ADMIN } });
    adminEliminarProducto.mockResolvedValue(null);
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderizar();
    await screen.findByRole('heading', { name: 'Zapatillas Runner' });

    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(confirmar).toHaveBeenCalledWith('¿Eliminar "Zapatillas Runner"?');
    expect(adminEliminarProducto).toHaveBeenCalledWith(15);
    expect(await screen.findByText('Listado de productos')).toBeInTheDocument();

    confirmar.mockRestore();
  });

  it('no elimina nada si el administrador cancela la confirmación', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ usuario: { rol: ROLES.ADMIN } });
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderizar();
    await screen.findByRole('heading', { name: 'Zapatillas Runner' });

    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(adminEliminarProducto).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Zapatillas Runner' })).toBeInTheDocument();
    expect(screen.queryByText('Listado de productos')).not.toBeInTheDocument();

    confirmar.mockRestore();
  });
});