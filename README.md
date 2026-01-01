# App tareas versión 1

## Ejecutar el proyecto

### Requisitos previos

1. Instalar la última versión LTS de Node.js.
2. Iniciar un servidor postgreSQL 16.11 en forma local o remota

### Instrucciones para ejecutar

1. Ejecutar este comando para clonar el repositorio
```txt
git clone https://github.com/esteban4321duran/app-tareas-webapp
```
2. En una terminal ubicada en el directorio raíz del proyecto, ejecutar este comando para instalar las dependencias:
```txt
npm install
```
3. En el directorio raíz del proyecto, crear un archivo llamado ".env"
4. En el archivo ".env" agregar la siguiente variable de entorno
```txt
DATABASE_URL=postgresql:[usuario]:[contraseña]@[dirección_servidor_bd]:[puerto_bd]/[nombre_bd]
```
5. Completar la URL:
* [usuario]: nombre de usuario de la base de datos 
* [contraseña]: contraseña del usuario de la base de datos
* [dirección_servidor_bd]: si es un servidor local localhost
* [puerto_bd]: por defecto 5432
* [nombre_bd]: por defecto postgres

por ejemplo:
```txt
DATABASE_URL=postgresql:esteban:1234@localhost:5432/postgres
```
6. Para esto, En una terminal ubicada en el directorio raiz del proyecto, ejecutar el siguiente comando para migrar la base de datos hasta la versión actual:
```txt
npx drizzle-kit migrate
```
7. En una terminal ubicada en el directorio raiz del proyecto, ejecutar el siguiente comando para ejecutar el script npm dev. Este script inicia el servidor de desarrollo y habilita el debugger:
```txt
npm run dev
```
8. En un navegador web abrir esta dirección: 

http://localhost:5173/

# Herramientas de desarrollo

## Administrar base de datos con drizzle studio

### Requisitos previos

1. Instalar la última versión LTS de Node.js.
2. Iniciar un servidor postgreSQL 16.11 en forma local o remota

### Instrucciones

Drizzle-kit ofrece una GUI para administrar fácilmente la base de datos. Para iniciar esta GUI:

1. Configurar la variable de entorno DATABASE_URL como se indicó [aquí](#instrucciones-para-ejecutar).
2. En una terminal ubicada en el directorio raíz del proyecto, ejecutar el comando:
```txt
npx drizzle-kit studio
```
3. En un navegador web abrir esta dirección:

https://local.drizzle.studio/

## Debugger en el navegador

### requisitos previos

* Instalar un navegador basado en chromium (Google chrome, Chromium, edge, etc).

### Instrucciones

Cloudflare ofrece un debugger en el navegador. Para debuggear el código con este debugger:

1. En una terminal ubicada en el directorio raiz del proyecto, ejecutar el siguiente comando para ejecutar el script npm dev. Este script inicia el servidor de desarrollo y habilita el debugger:
```txt
npm run dev
```
2. En un navegador web abrir esta dirección:

http://localhost:5173/__debug
