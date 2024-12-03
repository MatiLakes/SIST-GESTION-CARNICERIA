# Contributing to SISTEMA DE GESTIÓN DE CARNICERÍA

¡Hola y bienvenido! 👋  
Gracias por tu interés en contribuir a este proyecto. Es emocionante contar con tu participación para mejorar nuestro sistema de gestión, ya sea corrigiendo errores, proponiendo nuevas ideas o ayudando a construir una herramienta aún mejor. Cada sugerencia, línea de código y esfuerzo que aportes nos ayuda a hacer que este proyecto sea más útil para todos.

## Tabla de Contenidos
1. [Cómo contribuir](#cómo-contribuir)
2. [Configuración del entorno](#configuración-del-entorno)
3. [Estilo de código](#estilo-de-código)

---

## 1. Cómo contribuir

Queremos que seas parte de nuestro proyecto, y hay muchas maneras de hacerlo:
- **Reporta errores:** Si encuentras algo que no funciona bien, haznos saber.
- **Propone nuevas funcionalidades:** Tus ideas pueden llevar el proyecto a otro nivel.
- **Mejora la documentación:** Ayúdanos a que el proyecto sea más accesible para todos.
- **Envía código:** Si tienes una solución a un problema o quieres agregar algo nuevo, ¡adelante!

Si tienes algo en mente, abre un **issue** y conversemos. Juntos podemos definir el mejor camino para implementar tu idea o solucionar un problema.

## Cómo abrir un issue

Un **issue** es la manera de reportar errores, proponer nuevas ideas o pedir ayuda. Para abrir un issue en este proyecto:

1. Ve a la página principal del repositorio en **GitHub**.
2. Haz clic en la pestaña **Issues**.
3. Haz clic en el botón verde **New issue**.
4. Llena los campos requeridos:
   - **Título:** Un resumen claro y breve del problema o propuesta.
   - **Descripción:** Proporciona detalles, como pasos para reproducir un error, capturas de pantalla, o ejemplos de código.
   - **Etiquetas (opcional):** Si tienes permiso, clasifica el issue con etiquetas como `bug`, `enhancement`, o `question`.
5. Haz clic en **Submit new issue** para enviarlo.

Si es un error técnico, incluye toda la información necesaria, como:

- Mensajes de error completos.
- Pasos para reproducirlo.
- Detalles sobre tu entorno (sistema operativo, versión de Node.js, etc.).

## 2. Configuración del entorno

Antes de comenzar, sigue estos pasos para configurar tu entorno de desarrollo:

1. **Clona el repositorio**:

   git clone https://github.com/MatiLakes/SIST-GESTION-CARNICERIA.git
   cd SIST-GESTION-CARNICERIA

2. **Instala las dependencias del backend**:
    
    cd backend
    npm install

3. **Instala las dependencias del frontend**:

    cd ../frontend
    npm install

4. **Configura las variables de entorno para el backend**:
    Asegúrate de tener **pgAdmin** instalado y funcionando. Crea una base de datos en PostgreSQL antes de continuar. Aquí tienes un resumen de cómo hacerlo:

### Crear la base de datos en pgAdmin:

1. Abre **pgAdmin**.
2. Conéctate a tu servidor PostgreSQL.
3. Haz clic derecho en **Databases** y selecciona **Create > Database**.
4. Ingresa un nombre para tu base de datos (por ejemplo: `carniceria_db`) y haz clic en **Save**.
5. Una vez creada la base de datos, configura el archivo .env en la carpeta backend con las siguientes variables:

    Primero creamos el archivo env de la siguiente manera:

    cd ../backend
    cd config
    touch .env

    Ingresamos lo siguiente

    HOST=localhost
    PORT=3050
    DATABASE=el_nombre_de_tu_bd
    DB_USERNAME=el_username_de_tu_bd
    PASSWORD=la_contraseña_de_tu_bd
    ACCESS_TOKEN_SECRET= tu_clave_segura
    cookieKey=llave_de_la_cookie

5. **Inicia el backend**: 

    cd backend
    npm run start

6. **Inicia el frontend**:

Abre otra terminal

    cd frontend
    npm run dev

7. **Prueba el entorno: Verifica que**:

 -El backend esté corriendo en http://localhost:3050/api.
- El frontend esté disponible en http://localhost:3000.

## 3. Estilo de código

La consistencia en el estilo de código es clave para mantener un proyecto limpio y legible:

1. Usa **ESLint** para verificar que tu código siga las normas del proyecto:

   npm run lint

2. Sigue las reglas definidas en el archivo .**eslintrc.js** en ambas carpetas (backend y frontend).

3. Usa nombres de variables claros y descriptivos.

4. Si tienes dudas, revisa el código existente para guiarte y mantener la coherencia.


