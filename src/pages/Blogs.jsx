import Button from 'react-bootstrap/Button';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';
import '../styles/Blogs.css';

const casos = [
  {
    id: 1,
    titulo: 'hola',
    texto: 'que pasa??!!!', 
  },
  {
    id: 2,
    titulo: 'Spider-Man: Brand New Day Es BUENISIMAAAA',
    texto: 'Esto no tiene nada que ver con la pagina o los blu-rays, es algo que queria decir, de hecho si o si uno de los productos va a ser un blu-ray de la pelicula', 
  },
];

function Blogs() {
  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <h2 className="titulo-pagina">NOTICIAS IMPORTANTES</h2>

        {casos.map((c) => (
          <div className="blog-card" key={c.id}>
            <div className="blog-info">
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
              <Button variant="light" className="blog-boton">VER CASO</Button>
            </div>
            <div className="blog-imagen"></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Blogs;