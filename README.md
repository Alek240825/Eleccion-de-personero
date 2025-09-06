# Proyecto #1: Sistema de Elección de Personero Estudiantil

## Descripción
Sistema web sencillo para la gestión de elecciones de personero estudiantil. Permite a los estudiantes votar de forma segura y a los administradores gestionar el proceso electoral.

## Características Principales

### Vista Pública (Sin inicio de sesión)
- Página de inicio con información general
- Visualización de candidatos y sus propuestas
- Formulario de registro para estudiantes
- Formulario de inicio de sesion

### Panel de Administración
- Gestión de usuarios (CRUD)
  - Filtro y búsqueda de usuarios
  - Listado de usuarios registrados
- Visualización de votos
  - Filtro y búsqueda
  - Gráfico de resultados (diagrama de torta)
- Generación de reportes en PDF
  - Reporte de votaciones
  - Listado de estudiantes

### Módulo de Estudiantes
- Perfil de usuario básico
- Visualización de candidatos y sus propuestas
- Formulario de votación
- Vista de confirmación del voto

## Stack Tecnológico

### Frontend
- React.js 18
- React Router para navegación
- Tailwind CSS para estilos
- Shadcn/ui para componentes
- React Context para estado global simple

### Backend
- Node.js
- Express.js
- JWT para autenticación básica
- Bcrypt para contraseñas

### Base de Datos
- XAMPP
- MySQL Workbench para administración

### Herramientas de Desarrollo
- Visual Studio Code
- Git para control de versiones

## Requisitos del Sistema
- Node.js 18 o superior
- XAMPP
- NPM como gestor de paquetes

## Estructura de la Base de Datos
- usuarios (id, nombre, email, contraseña, rol)
- candidatos (id, nombre, grado, propuesta, foto)
- tarjetones (id, titulo, fecha_eleccion)
- votos (id, id_estudiante, id_tarjeton, id_candidato, fecha)

## Aspectos de Seguridad Básicos
- Autenticación con JWT
- Encriptación de contraseñas con Bcrypt
- Validación de formularios

## Estado del Proyecto
En desarrollo
