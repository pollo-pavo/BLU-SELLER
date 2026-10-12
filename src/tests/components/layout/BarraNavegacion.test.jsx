import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BarraNavegacion from '../../../components/layout/navbar';

describe('BarraNavegacion', () => {
  it('muestra todos los enlaces de navegación y de cuenta, cada uno hacia su ruta', () => {
    render(
      <MemoryRouter>
        <BarraNavegacion />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();

    const enlaces = [
      { nombre: 'Home', ruta: '/' },
      { nombre: 'Productos', ruta: '/Productos' },
      { nombre: 'Categorías', ruta: '/Categorias' },
      { nombre: 'Ofertas', ruta: '/Ofertas' },
      { nombre: 'Blogs', ruta: '/Blogs' },
      { nombre: 'Nosotros', ruta: '/Nosotros' },
      { nombre: 'Contacto', ruta: '/Contacto' },
      { nombre: 'Inicio de Sesión', ruta: '/InicioSesion' },
      { nombre: 'Registrate', ruta: '/Registro' },
    ];

    enlaces.forEach(({ nombre, ruta }) => {
      expect(screen.getByRole('link', { name: nombre })).toHaveAttribute('href', ruta);
    });

    expect(screen.getAllByRole('link')).toHaveLength(enlaces.length);
  });
});