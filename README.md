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

Antes de empezar, asegúrate de tener lo siguiente instalado:

- **Node.js** (v16 o superior)
- **PostgreSQL** (v13 o superior)
- **pgAdmin** (para gestionar bases de datos visualmente)
- **Git** (para clonar el repositorio)

---

## Instalación

Sigue estos pasos para configurar tu entorno:

1. **Clona el repositorio**:

    ```bash
    git clone https://github.com/MatiLakes/SIST-GESTION-CARNICERIA.git
    cd SIST-GESTION-CARNICERIA
    ```

2. **Instala las dependencias del backend**:

    ```bash
    cd backend
    npm install
    ```

3. **Instala las dependencias del frontend**:

    ```bash
    cd ../frontend
    npm install
    ```

4. **Configura las variables de entorno para el backend**:
    Asegúrate de tener **pgAdmin** instalado y funcionando. Crea una base de datos en PostgreSQL antes de continuar. Aquí tienes un resumen de cómo hacerlo:

### Crear la base de datos en pgAdmin:

1. Abre **pgAdmin**.
2. Conéctate a tu servidor PostgreSQL.
3. Haz clic derecho en **Databases** y selecciona **Create > Database**.
4. Ingresa un nombre para tu base de datos (por ejemplo: `carniceria_db`) y haz clic en **Save**.
5. Una vez creada la base de datos, configura el archivo .env en la carpeta backend con las siguientes variables:

    Primero creamos el archivo env de la siguiente manera:

    ```bash
    cd ../backend
    cd config
    touch .env
    ```
    
    Ingresamos lo siguiente

    ```bash
    HOST=localhost
    PORT=3050
    DATABASE=el_nombre_de_tu_bd
    DB_USERNAME=el_username_de_tu_bd
    PASSWORD=la_contraseña_de_tu_bd
    ACCESS_TOKEN_SECRET= tu_clave_segura
    cookieKey=llave_de_la_cookie
    ```
5. **Inicia el backend**: 

    ```bash
    cd backend
    npm run start
    ```
6. **Inicia el frontend**:

Abre otra terminal

    ```bash
    cd frontend
    npm run dev
    ```

7. **Prueba el entorno: Verifica que**:

 -El backend esté corriendo en http://localhost:3050/api.
- El frontend esté disponible en http://localhost:3000.
