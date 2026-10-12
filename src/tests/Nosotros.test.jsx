import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nosotros from '../pages/Nosotros';

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

describe('Nosotros', () => {
  it('muestra el header, el título y la descripción de la empresa', () => {

    render(<Nosotros />);

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nosotros', level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/Somos una empresa dedicada a ofrecer los mejores productos/)).toBeInTheDocument();
    expect(screen.getByText(/una experiencia de compra sencilla/)).toBeInTheDocument();
  });
});