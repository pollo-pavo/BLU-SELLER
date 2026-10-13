Tienda online de Blu-ray desarrollada con React, Express y PostgreSQL (Neon).

Requisitos:

- Node.js 20 o superior
- Una base de datos PostgreSQL (Neon)

Instalacion:

1. Instalar dependencias del frontend y del backend en terminal:

   ```
   npm install
   cd backend
   npm install
   ```

2. Crear un archivo .env en la raíz (ver .env.example):

   ```
   DATABASE_URL=cadena_de_conexion_de_neon
   ```

3. Crear las tablas y los datos de ejemplo ejecutando, en ese orden,
   database/schema.sql y database/seed.sql en la base de datos.

Pasos para ejecutar -

En dos terminales:

```
cd backend
npm run dev
```

```
npm run dev
```

La tienda queda en http://localhost:5173 y la API en http://localhost:3001.

Pruebas:

```
npm run test:run
npm run coverage
```

Usuarios de ejemplo:

| Rol | Correo |
|---|---|
| Administrador | admin@duoc.cl |
| Vendedor | vendedor@profesor.duoc.cl |
| Cliente | cliente@gmail.com |


Hecho por:
Miguel Gonzalez y Esteban Orellana
