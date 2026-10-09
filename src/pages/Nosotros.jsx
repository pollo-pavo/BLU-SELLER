import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';
import '../styles/Nosotros.css';

function Nosotros() {
  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina nosotros-contenido">
        <div className="nosotros-texto">
          <h2>Nosotros</h2>
          <p>
            Somos una empresa dedicada a ofrecer los mejores productos a
            nuestros clientes. Nuestro equipo trabaja cada día para brindar
            calidad, confianza y una experiencia de compra sencilla.
          </p>
        </div>

        <div className="nosotros-imagen"></div>
      </div>
    </>
  );
}

export default Nosotros;