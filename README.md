# Sistema de Apoyo a la Gestión de Carnicería

**Bienvenido al Sistema de Gestión de Carnicería** 🥩  
Este proyecto está diseñado para optimizar y simplificar la gestión de carnicerías, proporcionando herramientas para manejar listas de precios, varas de animales, inventarios, seguimiento de mermas, y mucho más.

## Tabla de Contenidos

1. [Características principales](#características-principales)
2. [Tecnologias Utilizadas](#tecnologías-utilizadas)
3. [Instrucciones para Instalar el Proyecto en Ubuntu Linux con Docker](#instrucciones-para-instalar-el-proyecto-en-ubuntu-linux-con-docker-)
4. [Instrucciones para Instalar el Proyecto en Windowsso](#instrucciones-para-instalar-el-proyecto-en-windows)
5. [Despliegue Manual en un Servidor](#despliegue-manual-en-un-servidor)
6. [Acceso al Sistema](#acceso-al-sistema)
7. [Contribuciones](#contribuciones)
8. [Licencia](#licencia)

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

## **Tecnologías Utilizadas**

### **Principales Herramientas y Plataformas**

| Tecnología         | Descripción                                                       | Versión Recomendada |
| ------------------ | ----------------------------------------------------------------- | ------------------- |
| **Docker**         | Plataforma para ejecutar aplicaciones en contenedores.            | 27.3.1              |
| **Docker Compose** | Herramienta para definir y ejecutar aplicaciones multicontenedor. | 2.30.3              |
| **Git**            | Control de versiones para el código fuente.                       | 2.40.1              |
| **Node.js**        | Entorno de ejecución de JavaScript en el backend.                 | 20.10.0             |
| **npm**            | Administrador de paquetes para Node.js.                           | 10.2.3              |
| **PostgreSQL**     | Sistema de gestión de bases de datos relacional.                  | 15.3                |


## Instrucciones para Instalar el Proyecto en Ubuntu Linux con Docker 🐧

A continuación, encontrarás una guía paso a paso, explicativa y detallada, para configurar e instalar el Sistema de Apoyo a la Gestión de Carnicería en una distribución Ubuntu Linux, utilizando Docker para simplificar la instalación.

## **Requisitos Previos**

### **1. Instalar Docker y Docker Compose**

Si no tienes Docker instalado, sigue estos pasos:

1. **Actualiza los paquetes**:
```bash
sudo apt update
```

2. **Instala dependencias necesarias:**
```bash
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
```

3. **Agrega la clave y repositorio de Docker:**
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

4. **Instala Docker:**
```bash
sudo apt update
sudo apt install -y docker-ce
```

5. **Verifica Docker:**
```bash
docker --version
```

6. **Instala Docker Compose:**
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.30.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker compose version
```

### **2.Instalar Node.js v20.10.0 y npm v10.2.3**

1. **Descarga Node.js desde NodeSource:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

2. **Instala Node.js y npm:**
```bash
sudo apt install -y nodejs
```

3. **Verifica las versiones:**
```bash
node --version
npm --version
```

4. **Actualiza npm a la versión específica v10.2.3:**
```bash
sudo npm install -g npm@10.2.3
```

5. **Confirma las versiones:**
```bash
node --version
npm --version
```

Debe aparecer:
Node.js: v20.10.0
npm: 10.2.3

### **3. Instalar Git**
```bash
sudo apt update && sudo apt install git -y
git --version
```

Configura el nombre de usuario y correo electrónico para Git:

Git necesita tu nombre y correo para identificar las confirmaciones (commits). Configura los valores globales ejecutando los siguientes comandos:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@example.com"
```
Procura usar el mismo correo que tienes en GitHub.

Verifica la configuración:
```bash
git config --global --list
```

Deberías ver algo similar a:

user.name=Tu Nombre
user.email=tuemail@example.com

### **4. Instalar PostgreSQL**

1. **Instala PostgreSQL:**
```bash
sudo apt install -y postgresql postgresql-contrib
```

2. **Inicia el servicio:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

3. **Crea la base de datos y usuario:**
```bash
sudo -u postgres psql
```

Dentro de psql, ejecuta:
```bash
CREATE DATABASE carniceria;
CREATE USER postgres WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE carniceria TO postgres;
\q
```

### **Instalación del Proyecto**

1. **Clonar el Repositorio**
```bash
git clone https://github.com/MatiLakes/SIST-GESTION-CARNICERIA.git
cd SIST-GESTION-CARNICERIA
```

2. **Configurar el Backend**

Navega al directorio src/config dentro del backend y crea el archivo .env:
```bash
cd backend/src/config
touch .env
nano .env
```
Pega la siguiente configuración:
```bash
DB_URL=postgresql://postgres:password@db:5432/carniceria
PORT=3050
HOST=0.0.0.0
ACCESS_TOKEN_SECRET=hola123
SESSION_SECRET=chao123
REFRESH_JWT_SECRET=refresh123
RESET_JWT_SECRET=reset123
```
Guarda y cierra el archivo (Ctrl + O, luego Ctrl + X).

Instala las dependencias del backend:
```bash
cd ../..
npm install
```

3. **Configurar el Frontend**

Navega a la carpeta del frontend y crea el archivo .env:
```bash
cd ../frontend
touch .env
nano .env
```

Pega la siguiente configuración:
```bash
VITE_BASE_URL=http://localhost:3050/api
```

Guarda el archivo y cierra.

Instala las dependencias del frontend:
```bash
npm install
```

4. **Modificar y Configurar el Archivo docker-compose.yml**

Abre el archivo docker-compose.yml de la raiz del proyecto

```bash
cd ..
nano docker-compose.yml
```

Modifica archivo docker-compose.yml en la raíz del proyecto y agrega lo siguiente:
```bash
services:
  backend:
    build: ./backend
    ports:
      - "3050:3050"  # El puerto 3050 está expuesto a la máquina host
    env_file:
      - ./backend/src/config/.env
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"  # El frontend se expone en el puerto 3000
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: carniceria
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
  ```
Solo deberías modificar:  

      - DATABASE=carniceria
      - DB_USERNAME=postgres
      - PASSWORD=password

5. **Levantar el Proyecto**
```bash
sudo docker compose up --build
```
### **Verificación del Proyecto**

Frontend: http://localhost:3000
Backend: http://localhost:3050/api
Base de Datos:
Host: localhost
Puerto: 5432
Usuario: postgres
Contraseña: password
Base de Datos: carniceria





## Instrucciones para Instalar el Proyecto en Windows

Sigue estos pasos detallados para configurar tu entorno y ejecutar el sistema en Windows:

1. **Instalar Git**

Git es necesario para clonar el repositorio del proyecto.

Descarga Git desde https://git-scm.com/.

Sigue las instrucciones del instalador.

Verifica la instalación abriendo una terminal (Git Bash o PowerShell) y ejecutando:
```bash
git --version
```

Debería mostrar la versión instalada de Git.

Después de instalar Git, debes configurar tu nombre y correo electrónico, que se utilizarán para identificar tus commits.

Abre Git Bash o PowerShell.

Configura tu nombre de usuario:
```bash
git config --global user.name "Tu Nombre"
Configura tu correo electrónico:
```
```bash
git config --global user.email "tuemail@example.com"
```

Procura usar el mismo correo que tienes en GitHub.

Verifica la configuración:
```bash
git config --global --list
```
Deberías ver algo similar a:

user.name=Tu Nombre
user.email=tuemail@example.com



2. **Instalar Node.js y npm**

Node.js es necesario para instalar las dependencias y ejecutar el proyecto.

Descarga la versión exacta de Node.js v20.10.0 desde el siguiente enlace:

[Node.js v20.10.0](https://www.npackd.org/p/org.nodejs.NodeJS/20.10)

Ejecuta el instalador y sigue las instrucciones.

Durante la instalación:

Asegúrate de seleccionar npm (Node Package Manager).

Verifica la instalación ejecutando en la terminal:
```bash
node --version
npm --version
```
Las versiones deben ser:

v20.10.0
10.2.3

Si npm no está en la versión correcta, actualízala manualmente ejecutando:
```bash
npm install -g npm@10.2.3
```
Confirma con:
```bash
npm --version
```
3. **Instalar Visual Studio Code**

Visual Studio Code (VSCode) es un editor de código ligero y potente para trabajar con el proyecto.

Descarga Visual Studio Code desde https://code.visualstudio.com/.

Ejecuta el instalador y sigue las instrucciones.

Durante la instalación:

Marca la opción "Agregar a PATH" para poder usar code desde la terminal.

Verifica la instalación abriendo una terminal y ejecutando:
```bash
code --version
```

Debería mostrar la versión instalada de Visual Studio Code.

4. **Instalar PostgreSQL**

PostgreSQL se utilizará como base de datos del proyecto.

Descarga PostgreSQL desde https://www.postgresql.org/.

Durante la instalación:

Configura un nombre de usuario (por defecto postgres).

Configura una contraseña para el usuario (password en este ejemplo).

Recuerda el puerto predeterminado 5432.

Verifica la instalación abriendo pgAdmin y conectándote a tu servidor PostgreSQL.

Crea la base de datos y el usuario ejecutando los siguientes comandos en la consola de psql:

```bash
CREATE DATABASE carniceria;
CREATE USER postgres WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE carniceria TO postgres;
\q
```

5. **Instalar Docker y Docker Compose**

Docker es necesario para ejecutar los contenedores de la aplicación.

Descarga Docker Desktop desde https://www.docker.com/products/docker-desktop/.

Sigue las instrucciones del instalador y reinicia tu equipo si es necesario.

Verifica la instalación abriendo una terminal y ejecutando:
```bash
docker --version
docker compose version
```
Ambas versiones deberían mostrarse correctamente.

6. **Clonar el Repositorio**

Abre una terminal (Git Bash o PowerShell) en la carpeta donde desees que se clone el proyecto.

Clona el repositorio y accede a la carpeta del proyecto:
```bash
git clone https://github.com/MatiLakes/SIST-GESTION-CARNICERIA.git
cd SIST-GESTION-CARNICERIA
```

7. **Configurar el Backend**

Navega al directorio src/config dentro del backend y crea el archivo .env:
```bash
cd backend/src/config
echo. > .env
```

Abre el archivo .env con Visual Studio Code

Agrega la siguiente configuración:
```bash
DB_URL=postgresql://postgres:password@db:5432/carniceria
PORT=3050
HOST=0.0.0.0
ACCESS_TOKEN_SECRET=hola123
SESSION_SECRET=chao123
REFRESH_JWT_SECRET=refresh123
RESET_JWT_SECRET=reset123
```

Guarda y cierra el archivo.

Instala las dependencias del backend:

```bash
cd ../..
npm install
```

8. **Configurar el Frontend**

Navega a la carpeta del frontend y crea el archivo .env:
```bash
cd ../frontend
echo. > .env
```

Abre el archivo .env con Visual Studio Code

Agrega la siguiente configuración:

```bash
VITE_BASE_URL=http://localhost:3050/api
```

Guarda el archivo y cierra.

Instala las dependencias del frontend:
```bash
npm install
```

9. **Modificar y Configurar el Archivo docker-compose.yml**

Modifica el archivo docker-compose.yml en la raíz del proyecto y agrega lo siguiente:

```bash
services:
  backend:
    build: ./backend
    ports:
      - "3050:3050"  # El puerto 3050 está expuesto a la máquina host
    env_file:
      - ./backend/src/config/.env
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"  # El frontend se expone en el puerto 3000
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: carniceria
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

10. **Levantar el Proyecto con Docker**

Asegúrate de estar en la raíz del proyecto donde se encuentra el archivo docker-compose.yml, en este caso, cd SIST-GESTION-CARNICERIA.

Ejecuta el siguiente comando:

```bash
docker compose up --build
```

Docker levantará los servicios frontend, backend, y la base de datos PostgreSQL.

11. **Verificar el Sistema**

Frontend: http://localhost:3000

Backend: http://localhost:3050/api

Base de Datos:

Host: localhost

Puerto: 5432

Usuario: postgres

Contraseña: password

Base de Datos: carniceria


## Despliegue Manual en un Servidor

Asegúrate de contar con lo siguiente:

Sistema operativo: Linux (Ubuntu 22.04 recomendado).
Acceso SSH al servidor.
Node.js v20.10.0 y npm v10.2.3 instalados.
PostgreSQL instalado o acceso a una base de datos remota.
PM2: Gestor de procesos de Node.js.
Git: Control de versiones.
Nginx (opcional): Para servir el frontend en producción.

1. **Acceso al Servidor**
Utiliza SSH para conectarte al servidor. Supongamos que el servidor tiene las siguientes credenciales:

IP: 192.168.1.100
Puerto SSH: 1669
Usuario: miusuario
Contraseña: miclave

```bash
ssh -p <PUERTO> <USUARIO>@<DIRECCION_IP>
```
Deberia ver así:
```bash
ssh -p 1669 miusuario@192.168.1.100
```
Si es la primera vez, confirma con yes y luego ingresa la contraseña (alvaro2024 en este caso).

2. **Preparar el Entorno del Servidor**
Actualizar el sistema
Actualiza los paquetes del servidor:

```bash
sudo apt update && sudo apt upgrade -y
```
Instalar herramientas básicas
```bash
sudo apt install -y curl git nano build-essential
```
Instalar Git
Verifica si Git está instalado:

```bash
git --version
```
Si no está, instálalo con:

```bash
sudo apt install -y git
Configura tu nombre y correo para Git:
```

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@example.com"
```

3. *Instalar Node.js y npm*
Instalar NVM (Node Version Manager)
NVM permite instalar y gestionar versiones de Node.js:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
```

Instalar Node.js v20.10.0 y npm v10.2.3
```bash
nvm install 20.10.0
npm install -g npm@10.2.3
```

Verifica las versiones:
```bash
node -v
npm -v
```

4.**Instalar PostgreSQL**
Si PostgreSQL no está instalado, instálalo con:

```bash
sudo apt install -y postgresql postgresql-contrib
```

Configurar PostgreSQL
1. **Inicia y habilita PostgreSQL:**

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

2. **Accede a PostgreSQL:**

```bash
sudo -u postgres psql
```

3. **Crea la base de datos y usuario:**

```bash
CREATE DATABASE carniceria;
CREATE USER miusuario WITH ENCRYPTED PASSWORD 'miclave';
GRANT ALL PRIVILEGES ON DATABASE carniceria TO miusuario;
\q
```

5. **Clonar el Proyecto**
Navega a la carpeta donde se guardará el proyecto y clónalo:

```bash
cd /var/www
git clone https://github.com/MatiLakes/SIST-GESTION-CARNICERIA.git
cd SIST-GESTION-CARNICERIA
```

6. **Configurar el Backend**

1. **Accede al directorio del backend:**

```bash
cd backend/src/config
```

2. **Crea el archivo .env:**

```bash
nano .env
```

3. **Configura la conexión a la base de datos:**

```bash
DB_URL=postgresql://miusuario:miclave@pgsqltrans.face.ubiobio.cl:5432/carniceria
PORT=3050
HOST=0.0.0.0
ACCESS_TOKEN_SECRET=hola123
SESSION_SECRET=chao123
REFRESH_JWT_SECRET=refresh123
RESET_JWT_SECRET=reset123
```

4. **Guarda y cierra el archivo (Ctrl + O, luego Ctrl + X).**

5. **Instala las dependencias:**

```bash
cd ../../
npm install
```

6. **Inicia el backend con PM2:**

```bash
pm2 start src/server.js --name backend-carniceria
pm2 save
pm2 startup
```

7. **Configurar el Frontend**

1. **Accede al directorio del frontend:**

```bash
cd ../frontend
```

2. **Crea el archivo .env:**

```bash
nano .env
```

3. **Configura la URL del backend:**

```bash
VITE_BASE_URL=http://192.168.1.100:3050/api
```

4. **Instala las dependencias:**

```bash
npm install
```

5. **Construye el frontend:**

```bash
npm run build
```

6. **Sirve el frontend con PM2:**

```bash
pm2 start npm --name frontend-carniceria -- run preview
pm2 save
```
8. **Verificación del Despliegue**
Frontend: http://192.168.1.100:4173
Backend: http://192.168.1.100:3050/api
Base de Datos:
Usuario: miusuario
Contraseña: miclave
Base de Datos: carniceria

9. **Restaurar PM2 en Caso de Reinicio**
Si el servidor se reinicia, restaura los procesos con:

```bash
pm2 resurrect
```

## Acceso al Sistema

Una vez levantado el sistema, puedes iniciar sesión en el frontend con las siguientes credenciales de administrador:

Correo: administrador2024@gmail.com

Clave: admin1234


## Contribuciones

Gracias por tu interés en mejorar este proyecto! 🙌
Valoramos cada aporte, ya sea reportando errores, sugiriendo nuevas ideas, o colaborando con mejoras al código o documentación.

**¿Cómo contribuir?**
Para facilitar el proceso de contribución y asegurar la calidad del proyecto, hemos preparado un archivo de pautas detallado. Por favor, revisa el archivo [CONTRIBUTING](./CONTRIBUTING) en la carpeta raíz del proyecto antes de comenzar. En este archivo encontrarás:

**Cómo reportar errores o abrir un issue:** Instrucciones para describir problemas de manera efectiva.
**Configurar el entorno de desarrollo:** Pasos para configurar tu entorno local y empezar a trabajar.
**Buenas prácticas de codificación:** Estándares y lineamientos para mantener la consistencia en el código.
**Proceso para enviar Pull Requests:** Cómo estructurar y enviar tus cambios para que puedan ser revisados e integrados rápidamente.

Nos encantaría que formes parte de este proyecto. ¡Gracias por contribuir! 

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

**Autores**: Álvaro Jorquera y Matías Lagos

