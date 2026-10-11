-- seed.sql: datos de prueba. Ejecutar despues de schema.sql.
-- Contrasena de todos los usuarios de prueba: Test1234

INSERT INTO usuarios (nombre, correo, contrasena, telefono, region, comuna, rol) VALUES
('Administrador Prueba', 'admin@correo.com',    '$2b$10$HsrryMS5.dvlLRK8APVxVu2Z4jfZadTd.5F/F/fJ15q8ueeU.AfiG', '911111111', 'Región Metropolitana de Santiago', 'Santiago', 'administrador'),
('Vendedor Prueba',      'vendedor@correo.com', '$2b$10$oBEjcZY6nbt89ttAYaX8aOUrfvEqM5vFXJ2DfzUOQwEmuWkrB77LW', '922222222', 'Región Metropolitana de Santiago', 'Providencia', 'vendedor'),
('Cliente Prueba',       'cliente@correo.com',  '$2b$10$bp2sOfjSL/t594rNuivAquLFQlu.jNI3QYHfD9Oa4cK8rCwN9lDm.', '933333333', 'Región Metropolitana de Santiago', 'Ñuñoa', 'cliente');

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
('hola', 'que pasa??!!!', 'que pasa??!!!', NULL, 1),
('Spider-Man: Brand New Day Es BUENISIMAAAA', 'Esto no tiene nada que ver con la pagina o los blu-rays, es algo que queria decir, de hecho si o si uno de los productos va a ser un blu-ray de la pelicula', 'Esto no tiene nada que ver con la pagina o los blu-rays, es algo que queria decir, de hecho si o si uno de los productos va a ser un blu-ray de la pelicula', NULL, 1);

INSERT INTO mensajes_contacto (nombre, correo, contenido) VALUES
('Cliente Prueba', 'cliente@correo.com', 'Todo mal!!');

UPDATE blogs SET contenido = 'desquiciado' WHERE id = 1;
UPDATE blogs SET contenido = 'eloquente' WHERE id = 2;

INSERT INTO ordenes (usuario_id, nombre, apellidos, correo, calle, departamento, region, comuna, indicaciones, total) VALUES
(3, 'Cliente', 'Prueba', 'cliente@correo.com', 'Calle Falsa 123', '603', 'Región Metropolitana de Santiago', 'Ñuñoa', 'Dejar con el conserje', 2600);

INSERT INTO orden_items (orden_id, producto_id, nombre, precio_unitario, cantidad) VALUES
(1, 1, 'Producto 1', 1000, 1),
(1, 2, 'Producto 2', 800, 2);