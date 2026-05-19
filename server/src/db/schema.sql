-- ============================================================
-- StreamMatch — Schema de Base de Datos
-- Ejecutar este archivo en MySQL Workbench antes de iniciar
-- ============================================================

CREATE DATABASE IF NOT EXISTS streamingdb;
USE streamingdb;

-- Tabla de películas (basada en MovieLens)
CREATE TABLE IF NOT EXISTS movies (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  genres      VARCHAR(255)  NOT NULL,  -- Ej: "Action|Comedy|Drama"
  year        INT,
  image_url   VARCHAR(500),
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios de la app
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ratings (calificaciones usuario → película)
-- Base del algoritmo de filtrado colaborativo
CREATE TABLE IF NOT EXISTS ratings (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  movie_id   INT NOT NULL,
  rating     DECIMAL(2,1) NOT NULL,  -- Valor entre 0.5 y 5.0
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rating (user_id, movie_id)  -- Un rating por película por usuario
);

-- Tabla de preferencias del usuario (géneros favoritos)
CREATE TABLE IF NOT EXISTS user_preferences (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  genres     VARCHAR(255) NOT NULL,  -- Géneros seleccionados al ingresar
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
