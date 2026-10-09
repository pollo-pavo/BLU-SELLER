DROP TABLE IF EXISTS imagenes_producto CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS mensajes_contacto CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(150) NOT NULL,
  correo         VARCHAR(100) NOT NULL UNIQUE,
  contrasena     VARCHAR(100) NOT NULL,          -- hash bcrypt, nunca texto plano
  telefono       VARCHAR(20),
  region         VARCHAR(300),
  comuna         VARCHAR(300),
  rol            VARCHAR(20) NOT NULL DEFAULT 'cliente'
                 CHECK (rol IN ('cliente', 'vendedor', 'administrador')),
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE productos (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(250) NOT NULL,
  descripcion    TEXT,
  precio         NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  stock          INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  imagen         VARCHAR(300),                   -- ruta, ej: /imagenes/producto1.png
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE imagenes_producto (
  id          SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  imagen      VARCHAR(300) NOT NULL,
  orden       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE blogs (
  id             SERIAL PRIMARY KEY,
  titulo         VARCHAR(250) NOT NULL,
  descripcion    VARCHAR(250) NOT NULL,          -- resumen para el listado
  contenido      TEXT NOT NULL,
  imagen_portada VARCHAR(300),
  autor_id       INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE mensajes_contacto (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  correo      VARCHAR(100) NOT NULL,
  contenido   TEXT NOT NULL,
  fecha_envio TIMESTAMP NOT NULL DEFAULT NOW(),
  revisado    BOOLEAN NOT NULL DEFAULT FALSE
);
