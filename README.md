# Sistema de Apoyo a la Gestión de Carnicería

**Bienvenido al Sistema de Gestión de Carnicería** 🥩  
Este proyecto está diseñado para optimizar y simplificar la gestión de carnicerías, proporcionando herramientas para manejar listas de precios, varas de animales, inventarios, seguimiento de mermas, y mucho más.

## Tabla de Contenidos

1. [Características principales](#características-principales)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Uso](#uso)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Contribuciones](#contribuciones)
7. [Licencia](#licencia)

---

## Características principales

El sistema aborda los siguientes problemas comunes en la gestión de carnicerías:

1. **Mermas**: Registro digital de las pérdidas de carne debido a descomposición o mal estado, con opciones para análisis posterior que ayuden a optimizar el inventario.
2. **Pagos Pendientes**: Gestión centralizada de clientes que compran a crédito, con un seguimiento claro de sus deudas y plazos de pago.
3. **Pedidos**: Registro organizado de los pedidos de productos, eliminando la dependencia de papel y reduciendo el riesgo de pérdida de información.
4. **Registro de Ganancias Estimadas**: Cálculo automático de ganancias basadas en los precios de compra y venta, con reportes detallados.
5. **Formularios de Resolución Sanitaria**: Generación automática y almacenamiento digital de los formularios exigidos por normativas sanitarias.
6. **Gestión de Proveedores**: Registro formal y digitalizado de los proveedores, con históricos de compras y herramientas para facilitar negociaciones.
7. **Gestión de Stock**: Control formal del inventario para evitar desabastecimiento o compras innecesarias.

Este sistema proporciona una solución integral para la administración moderna de carnicerías, mejorando la eficiencia y reduciendo errores.

---

## Requisitos previos

Antes de empezar, asegúrate de cumplir con los siguientes requisitos:

1. **Git**:
   - Git es una herramienta para controlar versiones de tu código.
   - Si no tienes Git instalado, descárgalo desde [git-scm.com](https://git-scm.com/) e instálalo siguiendo las instrucciones.
   - Una vez instalado, verifica la instalación ejecutando:

     ```bash
     git --version
     ```

     Debería mostrar la versión de Git instalada.

2. **Node.js**:
   - Necesitas Node.js para ejecutar el backend y frontend.
   - Descárgalo desde [nodejs.org](https://nodejs.org/) e instala la versión LTS recomendada.
   - Verifica la instalación ejecutando:

     ```bash
     node --version
     npm --version
     ```

     Esto mostrará las versiones de Node.js y npm (Node Package Manager).

3. **PostgreSQL y pgAdmin**:
   - PostgreSQL es el sistema de gestión de bases de datos utilizado por el proyecto.
   - Descárgalo desde [postgresql.org](https://www.postgresql.org/) e instala pgAdmin como herramienta visual para gestionar bases de datos.
   - Durante la instalación, configura un nombre de usuario y contraseña para PostgreSQL. Recuerda estos datos, ya que los necesitarás más adelante.

4. **Un editor de texto**:
   - Se recomienda instalar [Visual Studio Code](https://code.visualstudio.com/), un editor de código liviano y muy funcional.

---

## Instalación

Sigue estos pasos detallados para configurar tu entorno y ejecutar el sistema:

1. **Clona el repositorio**:
   - Abre una terminal o consola de comandos.
   - Ejecuta lo siguiente:

     ```bash
     git clone https://github.com/MatiLakes/SIST-GESTION-CARNICERIA.git
     cd SIST-GESTION-CARNICERIA
     ```

   Esto descargará el proyecto y te moverá a la carpeta del mismo.

2. **Instala las dependencias del backend**:
   - Cambia al directorio del backend:

     ```bash
     cd backend
     ```

   - Instala las dependencias necesarias:

     ```bash
     npm install
     ```

3. **Instala las dependencias del frontend**:
   - Regresa al directorio raíz y luego al directorio del frontend:

     ```bash
     cd ../frontend
     npm install
     ```

4. **Configura las variables de entorno para el backend**:
   - Asegúrate de tener pgAdmin abierto y conectado a tu servidor PostgreSQL.
   - Crea una base de datos para el proyecto siguiendo estos pasos:

     1. Abre **pgAdmin**.
     2. Conéctate a tu servidor PostgreSQL.
     3. Haz clic derecho en **Databases** y selecciona **Create > Database**.
     4. Ingresa un nombre para la base de datos (por ejemplo: `carniceria_db`) y haz clic en **Save**.

   - Configura las variables de entorno creando un archivo `.env`:

     ```bash
     cd ../backend/config
     touch .env
     ```

   - Abre el archivo `.env` en un editor de texto y copia lo siguiente, ajustando los valores según tu configuración:

     ```env
     HOST=localhost
     PORT=3050
     DATABASE=carniceria_db
     DB_USERNAME=tu_usuario_postgres
     PASSWORD=tu_contraseña_postgres
     ACCESS_TOKEN_SECRET=tu_clave_segura
     cookieKey=tu_llave_cookie
     ```

5. **Inicia el backend**:
   - Vuelve al directorio del backend:

     ```bash
     cd ../backend
     ```

   - Ejecuta el servidor:

     ```bash
     npm run start
     ```

   - Asegúrate de que el backend esté corriendo correctamente. Debería estar disponible en:

     ```
     http://localhost:3050/api
     ```

6. **Inicia el frontend**:
   - Abre una nueva terminal.
   - Ve al directorio del frontend:

     ```bash
     cd frontend
     ```

   - Ejecuta el servidor del frontend:

     ```bash
     npm run dev
     ```

   - El frontend debería estar disponible en:

     ```
     http://localhost:3000
     ```

7. **Verifica que el sistema esté funcionando**:
   - Abre un navegador y visita las URLs del backend y frontend para verificar que ambos estén activos.

---


