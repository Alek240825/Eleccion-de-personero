--- Creacion base de datos
CREATE DATABASE Eleccion_De_Personero;
USE Eleccion_De_Personero;

--- Tabla usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(250) NOT NULL,
    tipo_documento ENUM('RC','TI','CC','PP') NOT NULL,
    numero_documento BIGINT NOT NULL UNIQUE,
    correo VARCHAR(250) NOT NULL UNIQUE,
    contraseña VARCHAR(250) NOT NULL,
    rol ENUM('Administrador','Usuario') NOT NULL DEFAULT 'Usuario',
    estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- Tabla tarjetones
CREATE TABLE tarjetones (
    id_tarjeton INT AUTO_INCREMENT PRIMARY KEY,
    anio YEAR NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('En Curso','Finalizado') DEFAULT 'En Curso'
);

--- Tabla candidatos
CREATE TABLE candidatos (
    id_candidato INT AUTO_INCREMENT PRIMARY KEY,
    nombre_candidato VARCHAR(250) NOT NULL,
    propuesta TEXT,
    foto VARCHAR(255),
    id_tarjeton_fk INT NOT NULL,
        FOREIGN KEY (id_tarjeton_fk) REFERENCES tarjetones (id_tarjeton),
    id_usuario_fk INT NOT NULL,
        FOREIGN KEY (id_usuario_fk) REFERENCES usuarios (id_usuario)
);

--- Tabla votos
CREATE TABLE votos (
    id_voto INT AUTO_INCREMENT PRIMARY KEY,
    id_tarjeton_fk INT NOT NULL,
        FOREIGN KEY (id_tarjeton_fk) REFERENCES tarjetones (id_tarjeton),
    id_usuario_fk INT NOT NULL,
        FOREIGN KEY (id_usuario_fk) REFERENCES usuarios (id_usuario),
    id_candidato_fk INT NOT NULL,
        FOREIGN KEY (id_candidato_fk) REFERENCES candidatos (id_candidato),
    fecha_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_usuario_fk, id_tarjeton_fk) -- un usuario no puede votar dos veces en el mismo proceso
);
