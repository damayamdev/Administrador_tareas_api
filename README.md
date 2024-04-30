# Administrador_tareas_api

# Paso 1:

- Se inicializa con npm init --y
- Se instala express pnpm i express
- Se instala pnpm i -D @types/express
- Se instala pnpm i -D nodemon ts-node typescript
- Se instala pnpm i colors
- Se instala pnpm i express-validator
- Se instala pnpm i cors
- Se instala pnpm i bcrypt
- Se instala pnpm i --save-dev @types/bcrypt
- Se instala pnpm i nodemailer
- Se instala pnpm i -D @types/nodemailer

Mongoose es un *ODM* para Node.js

Instalamos todo lo que necesitamos para conectarnos la base de datos

- pnpm i mongoose dotenv

# Paso 2:

- Creamos la coneción a la base de datos

## Arquitectura

Definimos la arquitecrura MVC (Model View Controller), es un patrón de arquitectura de software que permite la separación de abligaciones de cada pieza de tu código.

### Modelo - Model
Encargado de todo lo relacionado a los datos, Base de datos y el CRUD, el Modelo esta muy relacionado a tu ORM o ODM

### Vista - View
Se encarga de todo lo que se ve en pantalla (HTML).

Nota:
El Modelo se encargará de consultar la base de datos pero es la vista la que se encarga de mostrar lo resultados.

### Controlador - Controller
Es el que cominica Modelo y vista, antes de que el modelo consulte a la base de datos el controlador en el encargado de llamarlo, una vez que el Modelo yo consultó la base de datos, es el controlador quien le cominica a la vista los datos para que los muestre.

### Router
Es el encargado de registrar todas las URL`s o Endpoints que soporta nuestra aplicación.

