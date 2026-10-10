import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';
import '../styles/Blogs.css';
import { Link } from 'react-router-dom';
import { obtenerBlogs } from '../services/api';

function Blogs() {
  const [casos, setCasos] = useState([]);

  useEffect(() => {
    obtenerBlogs()
      .then((datos) => setCasos(datos))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <h2 className="titulo-pagina">NOTICIAS IMPORTANTES</h2>

        {casos.map((c) => (
          <div className="blog-card" key={c.id}>
            <div className="blog-info">
              <h3>{c.titulo}</h3>
              <p>{c.descripcion}</p>
              <Button as={Link} to={`/blogs/${c.id}`} variant="light" className="blog-boton">VER CASO</Button>
            </div>
            <div className="blog-imagen"></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Blogs;