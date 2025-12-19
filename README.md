# 🛒 Frontend – Friki Mundo

Frontend desarrollado como parte del **Trabajo Final Integrador** del Bootcamp **Full Stack Engineer**, utilizando **React** y **Vite**, conectado a un backend en **Node.js + Express + MongoDB** (MERN), implementando carrito persistente, autenticación, rutas protegidas, panel de administración y checkout funcional.

---

## 📌 Tecnologías Utilizadas

- React
- Vite
- React Router DOM
- Zustand (State Management)
- Tailwind CSS
- Axios
- React Toastify
- JavaScript (ES6+)

---

## 🎨 Interfaz y Experiencia de Usuario

El frontend incluye:

- Diseño moderno y responsive
- **Modo claro / oscuro** con persistencia
- Feedback visual con **notificaciones Toast**
- Navegación fluida mediante **SPA (Single Page Application)**

---

## 🔐 Autenticación y Roles

El sistema maneja:

- Registro y login de usuarios
- Persistencia de sesión mediante **JWT**
- Protección de rutas privadas
- Diferenciación de roles:
  - Usuario
  - Administrador
- Renderizado condicional del menú según rol (Admin / Usuario)

---

## 🛍️ Funcionalidades Principales

### 📦 Productos
- Listado de productos desde el backend
- Vista de detalle del producto
- Selector de cantidad
- Agregado al carrito con feedback visual (Toast)

---

### 🛒 Carrito de Compras
- Carrito persistente (localStorage)
- Incrementar / disminuir cantidad
- Eliminar productos
- Vaciar carrito con confirmación interna
- Cálculo automático de total
- Indicador de cantidad en el Header

---

### 💳 Checkout
- Creación de orden real en el backend
- Envío del token JWT en la petición
- Limpieza automática del carrito al confirmar compra
- Feedback visual de éxito o error

---

### 🧾 Historial de Órdenes
- Vista de órdenes del usuario autenticado
- Despliegue de detalles por orden
- Cálculo de totales y subtotales
- Búsqueda por ID o producto
- Interfaz sin componentes extra (requisito del TP)

---

### 👑 Panel de Administración
Disponible solo para usuarios con rol **Admin**:

- Acceso desde el Header
- Gestión de productos
- Gestión de usuarios
- Visualización de órdenes globales

---

## 🧠 Manejo de Estado (Zustand)

Se utilizaron stores independientes para:

- `useAuthStore` → autenticación y usuario
- `useCartStore` → carrito de compras
- `useThemeStore` → modo claro / oscuro

Con persistencia en:
- `localStorage`
- `sessionStorage`

---

## 🌐 Comunicación con Backend

- Axios centralizado (`services/api.js`)
- Interceptores para enviar el token JWT
- Manejo de errores desde la UI
- Endpoints consumidos:
  - Auth
  - Products
  - Orders
  - Users (Admin)

---

## 🧪 Validaciones

- Validaciones en formularios (registro, login)
- Confirmación de contraseña
- Mensajes de error claros al usuario
- Validación visual de estados (loading, empty, error)

---

## ⚙️ Instalación y Ejecución

```bash
npm install
npm run dev
