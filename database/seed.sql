-- seed.sql: datos de prueba. Ejecutar despues de schema.sql.
-- Contrasena de todos los usuarios de prueba: Test1234

INSERT INTO usuarios (nombre, correo, contrasena, telefono, region, comuna, rol) VALUES
('Administrador Prueba', 'admin@correo.com',    '$2b$10$HsrryMS5.dvlLRK8APVxVu2Z4jfZadTd.5F/F/fJ15q8ueeU.AfiG', '911111111', 'Región Metropolitana de Santiago', 'Santiago', 'administrador'),
('Vendedor Prueba',      'vendedor@correo.com', '$2b$10$oBEjcZY6nbt89ttAYaX8aOUrfvEqM5vFXJ2DfzUOQwEmuWkrB77LW', '922222222', 'Región Metropolitana de Santiago', 'Providencia', 'vendedor'),
('Cliente Prueba',       'cliente@correo.com',  '$2b$10$bp2sOfjSL/t594rNuivAquLFQlu.jNI3QYHfD9Oa4cK8rCwN9lDm.', '933333333', 'Región Metropolitana de Santiago', 'Ñuñoa', 'cliente');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES
('Producto 1',  'Descripción del producto 1',  1000, 10, NULL),
('Producto 2',  'Descripción del producto 2',  1000, 10, NULL),
('Producto 3',  'Descripción del producto 3',  1000, 10, NULL),
('Producto 4',  'Descripción del producto 4',  1000, 10, NULL),
('Producto 5',  'Descripción del producto 5',  1000, 10, NULL),
('Producto 6',  'Descripción del producto 6',  1000, 10, NULL),
('Producto 7',  'Descripción del producto 7',  1000, 10, NULL),
('Producto 8',  'Descripción del producto 8',  1000, 10, NULL),
('Producto 9',  'Descripción del producto 9',  1000, 10, NULL),
('Producto 10', 'Descripción del producto 10', 1000, 10, NULL),
('Producto 11', 'Descripción del producto 11', 1000, 10, NULL),
('Producto 12', 'Descripción del producto 12', 1000, 10, NULL);

INSERT INTO blogs (titulo, descripcion, contenido, imagen_portada, autor_id) VALUES
('hola', 'que pasa??!!!', 'que pasa??!!!', NULL, 1),
('Spider-Man: Brand New Day Es BUENISIMAAAA', 'Esto no tiene nada que ver con la pagina o los blu-rays, es algo que queria decir, de hecho si o si uno de los productos va a ser un blu-ray de la pelicula', 'Esto no tiene nada que ver con la pagina o los blu-rays, es algo que queria decir, de hecho si o si uno de los productos va a ser un blu-ray de la pelicula', NULL, 1);

INSERT INTO mensajes_contacto (nombre, correo, contenido) VALUES
('Cliente Prueba', 'cliente@correo.com', 'Todo mal!!');
