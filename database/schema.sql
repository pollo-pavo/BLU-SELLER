DROP TABLE IF EXISTS imagenes_producto CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS mensajes_contacto CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS orden_items CASCADE;
DROP TABLE IF EXISTS ordenes CASCADE;

CREATE TABLE usuarios (
  id               SERIAL PRIMARY KEY,
  run              VARCHAR(9) NOT NULL UNIQUE,
  nombre           VARCHAR(50) NOT NULL,
  apellidos        VARCHAR(100) NOT NULL,
  correo           VARCHAR(100) NOT NULL UNIQUE,
  contrasena       VARCHAR(100) NOT NULL,          -- hash bcrypt, nunca texto plano
  fecha_nacimiento DATE,
  telefono         VARCHAR(20),
  direccion        VARCHAR(300) NOT NULL,
  region           VARCHAR(300),
  comuna           VARCHAR(300),
  rol              VARCHAR(20) NOT NULL DEFAULT 'cliente'
                   CHECK (rol IN ('cliente', 'vendedor', 'administrador')),
  fecha_creacion   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE categorias (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE productos (
  id             SERIAL PRIMARY KEY,
  codigo         VARCHAR(20) NOT NULL UNIQUE,
  nombre         VARCHAR(250) NOT NULL,
  descripcion    TEXT,
  precio         NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  precio_oferta  NUMERIC(10, 2) CHECK (precio_oferta >= 0),
  stock          INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  stock_critico  INTEGER NOT NULL DEFAULT 5 CHECK (stock_critico >= 0),
  categoria_id   INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  imagen         VARCHAR(300),
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

CREATE TABLE ordenes (
  id             SERIAL PRIMARY KEY,
  usuario_id     INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre         VARCHAR(100) NOT NULL,
  apellidos      VARCHAR(100) NOT NULL,
  correo         VARCHAR(100) NOT NULL,
  calle          VARCHAR(200) NOT NULL,
  departamento   VARCHAR(50),
  region         VARCHAR(300) NOT NULL,
  comuna         VARCHAR(300) NOT NULL,
  indicaciones   VARCHAR(500),
  total          NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  estado         VARCHAR(20) NOT NULL DEFAULT 'pagada'
                 CHECK (estado IN ('pagada', 'enviada', 'entregada', 'cancelada')),
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE orden_items (
  id              SERIAL PRIMARY KEY,
  orden_id        INTEGER NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id     INTEGER REFERENCES productos(id) ON DELETE SET NULL,
  nombre          VARCHAR(250) NOT NULL,
  precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  cantidad        INTEGER NOT NULL CHECK (cantidad > 0)
);