import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';
import '../styles/BlogDetalle.css';

function BlogDetalle() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setBlog(null);

    fetch(`/api/blogs/${id}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('Blog no encontrado');
        return respuesta.json();
      })
      .then((datos) => setBlog(datos))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <>
        <HeaderGeneral />
        <div className="fondo-pagina">
          <h2 className="titulo-pagina">{error}</h2>
          <Link to="/blogs">Volver a Blogs</Link>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <HeaderGeneral />
        <div className="fondo-pagina"></div>
      </>
    );
  }

  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <div className="blogdetalle-migas">
          <Link to="/">Home</Link> &gt; <Link to="/blogs">Blogs</Link> &gt; {blog.titulo}
        </div>

        <div className="blogdetalle-contenido">
          <h2>{blog.titulo}</h2>
          <span className="blogdetalle-datos">
            Por {blog.autor} · {new Date(blog.fecha_creacion).toLocaleDateString('es-CL')}
          </span>

          <div className="blogdetalle-imagen"></div>

          <p>{blog.contenido}</p>
        </div>
      </div>
    </>
  );
}

export default BlogDetalle;