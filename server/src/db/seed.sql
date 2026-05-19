-- ============================================================
-- StreamMatch — Datos de Ejemplo (Seed)
-- Basado en el dataset MovieLens (ml-latest-small)
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

USE streamingdb;

-- Películas de ejemplo (subconjunto representativo de MovieLens)
INSERT INTO movies (title, genres, year, description) VALUES
('Toy Story', 'Animation|Children|Comedy', 1995, 'Un vaquero de juguete teme ser reemplazado por un nuevo astronauta espacial.'),
('Jumanji', 'Adventure|Children|Fantasy', 1995, 'Un juego de mesa libera peligros del mundo salvaje en el mundo real.'),
('The Lion King', 'Animation|Children|Drama|Musical', 1994, 'Un joven león debe reclamar su lugar como rey de la Tierra del Orgullo.'),
('Pulp Fiction', 'Comedy|Crime|Drama|Thriller', 1994, 'Historias entrelazadas de criminales en Los Ángeles.'),
('The Shawshank Redemption', 'Crime|Drama', 1994, 'Un banquero inocente sobrevive años en una brutal prisión de Maine.'),
('Forrest Gump', 'Comedy|Drama|Romance|War', 1994, 'La vida de Forrest Gump, un hombre con un corazón enorme.'),
('The Matrix', 'Action|Sci-Fi|Thriller', 1999, 'Un hacker descubre la verdad sobre su realidad simulada.'),
('Titanic', 'Drama|Romance', 1997, 'Un amor imposible a bordo del Titanic en su viaje inaugural.'),
('Goodfellas', 'Crime|Drama', 1990, 'La historia de Henry Hill y su vida en la mafia.'),
('Schindler''s List', 'Drama|War', 1993, 'La historia real de Oskar Schindler, quien salvó judíos durante el Holocausto.'),
('Star Wars: Episode IV', 'Action|Adventure|Sci-Fi', 1977, 'Luke Skywalker se une a la Rebelión para derrotar al Imperio Galáctico.'),
('Inception', 'Action|Crime|Drama|Mystery|Sci-Fi|Thriller', 2010, 'Un ladrón que roba secretos a través de sueños recibe una misión imposible.'),
('The Dark Knight', 'Action|Crime|Drama|IMAX', 2008, 'Batman enfrenta al Joker, un criminal que quiere sumir Gotham en el caos.'),
('Interstellar', 'Sci-Fi|IMAX', 2014, 'Exploradores viajan a través de un agujero de gusano en busca de un nuevo hogar.'),
('The Silence of the Lambs', 'Crime|Horror|Thriller', 1991, 'Una agente del FBI pide ayuda al asesino Hannibal Lecter para atrapar a otro.'),
('Avengers: Endgame', 'Action|Adventure|Sci-Fi', 2019, 'Los Vengadores se reúnen para revertir los daños causados por Thanos.'),
('Spirited Away', 'Animation|Adventure|Fantasy', 2001, 'Una niña queda atrapada en un mundo mágico y trabaja para liberar a sus padres.'),
('The Godfather', 'Crime|Drama', 1972, 'El patriarca de una familia mafiosa transfiere el control a su hijo reacio.'),
('Coco', 'Animation|Adventure|Children|Comedy|Fantasy|Musical|Mystery', 2017, 'Un niño viaja al mundo de los muertos para descubrir la historia de su familia.'),
('Get Out', 'Horror|Mystery|Thriller', 2017, 'Un joven afroamericano descubre una perturbadora verdad al visitar a los padres de su novia.');

-- Usuarios de ejemplo
INSERT INTO users (name, email) VALUES
('Ana García', 'ana@example.com'),
('Carlos López', 'carlos@example.com'),
('María Rodríguez', 'maria@example.com'),
('Juan Martínez', 'juan@example.com'),
('Laura Pérez', 'laura@example.com');

-- Ratings de ejemplo (simulando el dataset MovieLens)
-- Usuario 1 (Ana) — le gustan animación y drama
INSERT INTO ratings (user_id, movie_id, rating) VALUES
(1, 1, 5.0), (1, 3, 4.5), (1, 6, 4.0), (1, 17, 5.0), (1, 19, 4.5);

-- Usuario 2 (Carlos) — le gustan acción y ciencia ficción
INSERT INTO ratings (user_id, movie_id, rating) VALUES
(2, 7, 5.0), (2, 11, 4.5), (2, 12, 5.0), (2, 13, 5.0), (2, 14, 4.5), (2, 16, 4.0);

-- Usuario 3 (María) — le gustan crimen y thriller
INSERT INTO ratings (user_id, movie_id, rating) VALUES
(3, 4, 4.5), (3, 5, 5.0), (3, 9, 4.5), (3, 15, 4.0), (3, 18, 5.0);

-- Usuario 4 (Juan) — gustos variados
INSERT INTO ratings (user_id, movie_id, rating) VALUES
(4, 1, 3.5), (4, 4, 4.0), (4, 7, 4.5), (4, 8, 3.0), (4, 12, 4.5), (4, 13, 5.0);

-- Usuario 5 (Laura) — le gustan drama y romance
INSERT INTO ratings (user_id, movie_id, rating) VALUES
(5, 5, 4.5), (5, 6, 5.0), (5, 8, 4.5), (5, 10, 4.0), (5, 18, 4.0);
