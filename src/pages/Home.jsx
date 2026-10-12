import { useState, useEffect } from 'react';
import { Carousel, Container, Row, Col, Card } from 'react-bootstrap';
import HeaderGeneral from '../components/layout/HeaderGeneral';
import { Link } from 'react-router-dom';
import { obtenerProductos, obtenerCategorias } from '../services/api';
import '../styles/General.css';
import '../styles/Home.css';

const slides = [
  { id: 1, titulo: 'Nuevos Lanzamientos', texto: 'Descubre los últimos juegos disponibles en nuestra tienda.' },
  { id: 2, titulo: 'Ofertas de la semana', texto: 'Aprovecha los mejores descuentos.' },
  { id: 3, titulo: 'Los más vendidos', texto: 'Lo que más eligen nuestros clientes.' },
];

const categorias = [
  { id: 1, nombre: 'Categoría 1' },
  { id: 2, nombre: 'Categoría 2' },
  { id: 3, nombre: 'Categoría 3' },
];

function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    obtenerProductos()
      .then((datos) => setProductos(datos))
      .catch((error) => console.error(error));
    obtenerCategorias()
      .then((datos) => setCategorias(datos))
      .catch((error) => console.error(error));
  }, []);

  const destacados = productos.slice(0, 4);

  return (
    <>
      <div className='home-fondo'>
        <HeaderGeneral />

        <Carousel className="home-carrusel">
          {slides.map((s) => (
            <Carousel.Item key={s.id}>
              <div className="home-slide">1200 x 300</div>
              <Carousel.Caption>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        <Container className="home-categorias">
          <h2 className='titulo-pagina'>Categorías</h2>
          <Row>
            {categorias.map((c) => (
              <Col md={4} key={c.id} className="mb-4">
                <Card as={Link} to={`/categorias/${c.id}`} className="home-tarjeta">
                  <div className="home-tarjeta-imagen">400 x 200</div>
                  <Card.Body>
                    <Card.Title>{c.nombre}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        <Container className="home-productos">
          <h2 className='titulo-pagina'>Productos destacados</h2>
          <Row>
            {destacados.map((p) => (
              <Col sm={6} lg={3} key={p.id} className="mb-4">
                <Card className="home-producto">
                  <div className="home-producto-imagen">300 x 200</div>
                  <Card.Body>
                    <Card.Title>{p.nombre}</Card.Title>
                    <Card.Text className="home-producto-precio">
                      ${Number(p.precio).toLocaleString('es-CL')}
                    </Card.Text>
                    <Link to={`/productos/${p.id}`} className="btn btn-primary btn-sm">
                      Ver detalle
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="home-productos-ver">
            <Link to="/productos" className="btn btn-outline-light">
              Ver todos los productos
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Home;