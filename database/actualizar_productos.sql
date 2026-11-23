-- Para la base que YA existe (por ejemplo Neon): pone nombres reales y la imagen de cada producto.
-- No borra datos: solo actualiza los 12 productos de ejemplo (por su codigo) y los nombres en la orden de ejemplo.
-- Las imagenes viven en public/imagenes/productos/ del frontend.
UPDATE productos AS p
SET nombre = v.nombre, descripcion = v.descripcion, imagen = v.imagen
FROM (VALUES
  ('P001', 'Interstellar', 'Película de ciencia ficción dirigida por Christopher Nolan (2014). Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.', '/imagenes/productos/interstellar.jpg'),
  ('P002', 'The Dark Knight', 'Película de acción y crimen dirigida por Christopher Nolan (2008). Batman se enfrenta al Joker en una Gotham al borde del caos.', '/imagenes/productos/the-dark-knight.jpg'),
  ('P003', 'Inception', 'Película de ciencia ficción y suspenso dirigida por Christopher Nolan (2010). Un ladrón especializado en robar secretos a través de los sueños recibe una misión imposible.', '/imagenes/productos/inception.jpg'),
  ('P004', 'Breaking Bad: Serie completa', 'Serie creada por Vince Gilligan (2008–2013). Un profesor de química con cáncer terminal se asocia con un antiguo alumno para fabricar metanfetamina. Cinco temporadas.', '/imagenes/productos/breaking-bad.jpg'),
  ('P005', 'Chernobyl: Miniserie', 'Miniserie de HBO (2019) sobre el desastre nuclear de 1986 y el esfuerzo por contener sus consecuencias. Cinco episodios.', '/imagenes/productos/chernobyl.jpg'),
  ('P006', 'Game of Thrones: Temporada 1', 'Primera temporada de la serie de fantasía de HBO (2011), basada en las novelas de George R. R. Martin. Diez episodios.', '/imagenes/productos/game-of-thrones-t1.jpg'),
  ('P007', 'Blade Runner: The Final Cut', 'Edición definitiva de la película de ciencia ficción dirigida por Ridley Scott (1982). Un cazador de replicantes persigue a un grupo de androides fugitivos.', '/imagenes/productos/blade-runner-final-cut.jpg'),
  ('P008', 'Apocalypse Now: Final Cut', 'Versión Final Cut de la película bélica dirigida por Francis Ford Coppola (1979). Un capitán viaja río arriba por la selva para encontrar a un coronel rebelde.', '/imagenes/productos/apocalypse-now-final-cut.jpg'),
  ('P009', 'Alien: Director''s Cut', 'Versión del director de la película de ciencia ficción y terror de Ridley Scott (1979). La tripulación de una nave comercial se topa con una criatura mortal.', '/imagenes/productos/alien-directors-cut.jpg'),
  ('P010', 'El Señor de los Anillos: La trilogía', 'Trilogía de fantasía dirigida por Peter Jackson (2001–2003), basada en las novelas de J. R. R. Tolkien: La comunidad del anillo, Las dos torres y El retorno del rey.', '/imagenes/productos/el-senor-de-los-anillos.jpg'),
  ('P011', 'El Padrino: La colección', 'Colección de las tres películas de Francis Ford Coppola (1972, 1974 y 1990) sobre la familia criminal Corleone.', '/imagenes/productos/el-padrino.jpg'),
  ('P012', 'Volver al Futuro: La trilogía', 'Trilogía de aventuras y ciencia ficción dirigida por Robert Zemeckis (1985–1990), protagonizada por Marty McFly y el doctor Emmett Brown.', '/imagenes/productos/volver-al-futuro.jpg')
) AS v(codigo, nombre, descripcion, imagen)
WHERE p.codigo = v.codigo;

UPDATE orden_items AS oi
SET nombre = p.nombre
FROM productos AS p
WHERE oi.producto_id = p.id AND oi.nombre LIKE 'Producto %';
