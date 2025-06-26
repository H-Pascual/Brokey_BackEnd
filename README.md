# 🛠️ Brokey - Backend

**Proyecto Fin de Ciclo DAW**  
**Autor:** Héctor Pascual  
**Backend desarrollado con:** Node.js + Express + Sequelize + MariaDB

---

## 📌 Descripción

Este repositorio contiene el backend de la plataforma **Brokey**, una aplicación web centrada en facilitar la inversión en bolsa a usuarios particulares. El backend gestiona la lógica de negocio, la seguridad, el acceso a datos y la interacción con APIs externas de stocks.

---

## 🔧 Tecnologías Utilizadas

- **Node.js**
- **Express**
- **Sequelize**
- **MariaDB**
- **JWT (Autenticación)**
- **dotenv**
- **bcrypt**
- **CORS**
- **API Stocks (AlphaVantage)**

---

## 🧩 Estructura del Proyecto

### 🔐 Rutas Principales

- `/users`: Registro y autenticación de usuarios
- `/portfolios`: Gestión de carteras de inversión
- `/stocks`: Gestión y consulta de acciones
- `/operations`: Compra/venta de acciones
- `/transactions`: Movimientos monetarios
- `/likes`: Acciones favoritas
- `/contains`: Vinculación entre portfolios y acciones

### 🌐 API Externa

- `/cryptos`, `/shares`, `/commodities`: Información en tiempo real desde API externa
- `/cryptos_local`, `/shares_local`, `/commodities_local`: Información local (JSON)

---

## 💽 Base de Datos

- Modelo relacional diseñado en MariaDB
- Gestión mediante **Sequelize**
- Relaciones:
  - Un usuario puede tener múltiples portfolios
  - Un portfolio puede contener múltiples acciones
  - Cada operación actualiza simultáneamente varias tablas

---

## 🔐 Seguridad

- Autenticación basada en JWT
- Middleware `auth.protegerRuta` para proteger rutas privadas
- Control de CORS para permitir comunicación con frontend en `localhost:4200`

---

## ⚙️ Instalación y ejecución

1. **Clona el repositorio:**
   ```bash
   git clone ...
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Crea un archivo `.env` con el puerto y claves necesarias:**
   ```env
   PUERTO=8080
   JWT_SECRET=your_jwt_secret
   ```

4. **Carga los datos iniciales (opcional):**
   ```js
   cargadatos.loadStocksFromJSON();
   ```

5. **Ejecuta el servidor:**
   ```bash
   node index.js
   ```

---

## 🧪 Testing

Incluye una colección de **Postman** (`postman_collection.json`) para probar los endpoints REST.

---

## 🗃️ Archivos Adicionales

- `stocks.sql`: Script de base de datos para importar tablas y datos
- `postman_collection.json`: Colección de pruebas para API

---

## 🧠 Consideraciones del Proyecto

- Debido al límite de peticiones de la API gratuita, se implementó un sistema de almacenamiento local con JSONs y una **API espejo**
- Automatización de procesos en operaciones: al comprar se actualiza el saldo, la relación con el stock y el historial automáticamente
- En producción se recomienda migrar a una API de pago para mejorar la actualización de datos y fiabilidad

---

**Gracias por revisar el backend de Brokey 🚀**