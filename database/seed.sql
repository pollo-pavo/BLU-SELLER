-- seed.sql: datos de prueba. Ejecutar despues de schema.sql.

INSERT INTO usuarios (run, nombre, apellidos, correo, contrasena, fecha_nacimiento, telefono, direccion, region, comuna, rol) VALUES
('111111111', 'Admin',    'Prueba', 'admin@duoc.cl',            '$2b$10$HsrryMS5.dvlLRK8APVxVu2Z4jfZadTd.5F/F/fJ15q8ueeU.AfiG', '1990-01-15', '911111111', 'Av. Libertador Bernardo O''Higgins 1000', 'Región Metropolitana de Santiago', 'Santiago',    'administrador'),
('123456785', 'Vendedor', 'Prueba', 'vendedor@profesor.duoc.cl', '$2b$10$oBEjcZY6nbt89ttAYaX8aOUrfvEqM5vFXJ2DfzUOQwEmuWkrB77LW', NULL,         '922222222', 'Av. Providencia 1234',                   'Región Metropolitana de Santiago', 'Providencia', 'vendedor'),
('222222222', 'Cliente',  'Prueba', 'cliente@gmail.com',         '$2b$10$bp2sOfjSL/t594rNuivAquLFQlu.jNI3QYHfD9Oa4cK8rCwN9lDm.', '2000-06-30', '933333333', 'Av. Irarrázaval 2000',                   'Región Metropolitana de Santiago', 'Ñuñoa',       'cliente');

INSERT INTO categorias (nombre) VALUES
('Películas'), ('Series'), ('Ediciones especiales'), ('Sagas');

INSERT INTO productos (codigo, nombre, descripcion, precio, precio_oferta, stock, categoria_id, imagen) VALUES
('P001', 'Producto 1',  'Descripción del producto 1',  1000, NULL, 10, 1, NULL),
('P002', 'Producto 2',  'Descripción del producto 2',  1000, 800,  10, 1, NULL),
('P003', 'Producto 3',  'Descripción del producto 3',  1000, NULL, 10, 1, NULL),
('P004', 'Producto 4',  'Descripción del producto 4',  1000, NULL, 3,  2, NULL),
('P005', 'Producto 5',  'Descripción del producto 5',  1000, NULL, 10, 2, NULL),
('P006', 'Producto 6',  'Descripción del producto 6',  1000, NULL, 10, 2, NULL),
('P007', 'Producto 7',  'Descripción del producto 7',  1000, 800,  10, 3, NULL),
('P008', 'Producto 8',  'Descripción del producto 8',  1000, NULL, 10, 3, NULL),
('P009', 'Producto 9',  'Descripción del producto 9',  1000, NULL, 3,  3, NULL),
('P010', 'Producto 10', 'Descripción del producto 10', 1000, NULL, 10, 4, NULL),
('P011', 'Producto 11', 'Descripción del producto 11', 1000, NULL, 10, 4, NULL),
('P012', 'Producto 12', 'Descripción del producto 12', 1000, NULL, 10, 4, NULL);

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
(1, 1, 'Producto 1', 1000, 1),
(1, 2, 'Producto 2', 800, 2);