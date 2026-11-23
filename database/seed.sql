-- seed.sql: datos de prueba. Ejecutar despues de schema.sql.

INSERT INTO usuarios (run, nombre, apellidos, correo, contrasena, fecha_nacimiento, telefono, direccion, region, comuna, rol) VALUES
('111111111', 'Admin',    'Prueba', 'admin@duoc.cl',            '$2b$10$HsrryMS5.dvlLRK8APVxVu2Z4jfZadTd.5F/F/fJ15q8ueeU.AfiG', '1990-01-15', '911111111', 'Av. Libertador Bernardo O''Higgins 1000', 'Región Metropolitana de Santiago', 'Santiago',    'administrador'),
('123456785', 'Vendedor', 'Prueba', 'vendedor@profesor.duoc.cl', '$2b$10$oBEjcZY6nbt89ttAYaX8aOUrfvEqM5vFXJ2DfzUOQwEmuWkrB77LW', NULL,         '922222222', 'Av. Providencia 1234',                   'Región Metropolitana de Santiago', 'Providencia', 'vendedor'),
('222222222', 'Cliente',  'Prueba', 'cliente@gmail.com',         '$2b$10$bp2sOfjSL/t594rNuivAquLFQlu.jNI3QYHfD9Oa4cK8rCwN9lDm.', '2000-06-30', '933333333', 'Av. Irarrázaval 2000',                   'Región Metropolitana de Santiago', 'Ñuñoa',       'cliente');

INSERT INTO categorias (nombre) VALUES
('Películas'), ('Series'), ('Ediciones especiales'), ('Sagas');

INSERT INTO productos (codigo, nombre, descripcion, precio, precio_oferta, stock, categoria_id, imagen) VALUES
('P001', 'Interstellar', 'Película de ciencia ficción dirigida por Christopher Nolan (2014). Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.', 1000, NULL, 10, 1, '/imagenes/productos/interstellar.jpg'),
('P002', 'The Dark Knight', 'Película de acción y crimen dirigida por Christopher Nolan (2008). Batman se enfrenta al Joker en una Gotham al borde del caos.', 1000, 800, 10, 1, '/imagenes/productos/the-dark-knight.jpg'),
('P003', 'Inception', 'Película de ciencia ficción y suspenso dirigida por Christopher Nolan (2010). Un ladrón especializado en robar secretos a través de los sueños recibe una misión imposible.', 1000, NULL, 10, 1, '/imagenes/productos/inception.jpg'),
('P004', 'Breaking Bad: Serie completa', 'Serie creada por Vince Gilligan (2008–2013). Un profesor de química con cáncer terminal se asocia con un antiguo alumno para fabricar metanfetamina. Cinco temporadas.', 1000, NULL, 3, 2, '/imagenes/productos/breaking-bad.jpg'),
('P005', 'Chernobyl: Miniserie', 'Miniserie de HBO (2019) sobre el desastre nuclear de 1986 y el esfuerzo por contener sus consecuencias. Cinco episodios.', 1000, NULL, 10, 2, '/imagenes/productos/chernobyl.jpg'),
('P006', 'Game of Thrones: Temporada 1', 'Primera temporada de la serie de fantasía de HBO (2011), basada en las novelas de George R. R. Martin. Diez episodios.', 1000, NULL, 10, 2, '/imagenes/productos/game-of-thrones-t1.jpg'),
('P007', 'Blade Runner: The Final Cut', 'Edición definitiva de la película de ciencia ficción dirigida por Ridley Scott (1982). Un cazador de replicantes persigue a un grupo de androides fugitivos.', 1000, 800, 10, 3, '/imagenes/productos/blade-runner-final-cut.jpg'),
('P008', 'Apocalypse Now: Final Cut', 'Versión Final Cut de la película bélica dirigida por Francis Ford Coppola (1979). Un capitán viaja río arriba por la selva para encontrar a un coronel rebelde.', 1000, NULL, 10, 3, '/imagenes/productos/apocalypse-now-final-cut.jpg'),
('P009', 'Alien: Director''s Cut', 'Versión del director de la película de ciencia ficción y terror de Ridley Scott (1979). La tripulación de una nave comercial se topa con una criatura mortal.', 1000, NULL, 3, 3, '/imagenes/productos/alien-directors-cut.jpg'),
('P010', 'El Señor de los Anillos: La trilogía', 'Trilogía de fantasía dirigida por Peter Jackson (2001–2003), basada en las novelas de J. R. R. Tolkien: La comunidad del anillo, Las dos torres y El retorno del rey.', 1000, NULL, 10, 4, '/imagenes/productos/el-senor-de-los-anillos.jpg'),
('P011', 'El Padrino: La colección', 'Colección de las tres películas de Francis Ford Coppola (1972, 1974 y 1990) sobre la familia criminal Corleone.', 1000, NULL, 10, 4, '/imagenes/productos/el-padrino.jpg'),
('P012', 'Volver al Futuro: La trilogía', 'Trilogía de aventuras y ciencia ficción dirigida por Robert Zemeckis (1985–1990), protagonizada por Marty McFly y el doctor Emmett Brown.', 1000, NULL, 10, 4, '/imagenes/productos/volver-al-futuro.jpg');

INSERT INTO blogs (titulo, descripcion, contenido, imagen_portada, autor_id) VALUES
('¿Por qué el Blu-ray sigue siendo igual de importante?',
 'Explicación detrás de la importancia del Blu-ray en la era del internet',
 'Hace poco hubo un caos por el reciente intento de atentado contra los formatos físicos de los videojuegos, y en ese sentido, Blu-ray es EL formato físico para el sector de las películas y series, es la propiedad real del consumidor y posee una independencia del internet, además, por favor, todos nos preguntamos qué contenido adicional exclusivo traerá el blu-ray de nuestra película favorita del año',
 NULL, 1),
('Cómo cuidar y ordenar tu colección de Blu-ray',
 'Algunos consejos simples para que tus discos duren años: cómo guardarlos, limpiarlos y organizarlos.',
 'Para que tus discos se mantengan en buen estado, guárdalos siempre en su caja y de forma vertical, lejos del calor, la humedad y la luz directa del sol. Tómalos por los bordes y evita tocar la superficie brillante. Si tienen polvo o huellas, límpialos con un paño suave de microfibra, siempre desde el centro hacia afuera y nunca en círculos. Por último, ordena tu colección por saga, género o año de estreno: así encontrarás cada película rápido y notarás qué títulos te faltan. Hasta luego y muchas gracias por leer!!',
 NULL, 1);

INSERT INTO mensajes_contacto (nombre, correo, contenido) VALUES
('Cliente Prueba', 'cliente@correo.com', 'Todo mal!!');

INSERT INTO ordenes (usuario_id, nombre, apellidos, correo, calle, departamento, region, comuna, indicaciones, total) VALUES
(3, 'Cliente', 'Prueba', 'cliente@gmail.com', 'Calle Falsa 123', '603', 'Región Metropolitana de Santiago', 'Ñuñoa', 'Dejar con el conserje', 2600);

INSERT INTO orden_items (orden_id, producto_id, nombre, precio_unitario, cantidad) VALUES
(1, 1, 'Interstellar', 1000, 1),
(1, 2, 'The Dark Knight', 800, 2);