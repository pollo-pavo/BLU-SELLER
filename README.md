# Blu-Seller · Frontend

Tienda online de Blu-ray hecha con React 19 y Vite. Consume la API REST del repositorio **blu-seller-backend** (Spring Boot, PostgreSQL, JWT).

## Requisitos

- Node.js 20 o superior
- El backend `blu-seller-backend` corriendo en http://localhost:8080 (ver su README)

## Instalación y ejecución

1. Instalar dependencias:

   ```
   npm install
   ```

2. Crear un archivo `.env` en la raíz (ver `.env.example`) con el Client ID de Google:

   ```
   VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
   ```

   Solo se necesita para el botón "Iniciar sesión con Google". El mismo valor va como `GOOGLE_CLIENT_ID` en el `.env` del backend. No pongas claves secretas aquí: las variables `VITE_` quedan visibles en el navegador.

3. Levantar primero el backend y luego la tienda:

   ```
   npm run dev
   ```

La tienda queda en http://localhost:5173. Vite redirige `/api` hacia http://localhost:8080, y el frontend llama a `/api/v1/...`.

## Roles

| Rol | Acceso |
|---|---|
| Cliente | Tienda, carrito, compra (requiere sesión) y "Mis pedidos" |
| Vendedor | Panel en solo lectura: órdenes y productos |
| Administrador | Panel completo: productos, categorías, usuarios, órdenes, dashboard y reportes |

## Pruebas

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
