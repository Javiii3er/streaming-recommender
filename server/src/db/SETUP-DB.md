# Configuración de la Base de Datos — StreamMatch

## Orden de ejecución en MySQL Workbench

Ejecuta los archivos en este orden exacto:

### 1. schema.sql
Crea la base de datos y todas las tablas necesarias.

### 2. seed-completo.sql
Carga las 214 películas con imágenes y descripciones reales de TMDB.

---

## Después de implementar la autenticación

Cuando agregues la columna `password` a la tabla `users`, necesitarás
actualizar el seed para que Javier también tenga esos cambios.

Para hacerlo:

1. En MySQL Workbench ejecuta esta query:
   SELECT * FROM users;

2. En el panel de resultados busca el ícono Export (disquete o flecha arriba)

3. Guárdalo como `seed-users.sql` en esta misma carpeta

4. Sube el archivo a GitHub:
   git add .
   git commit -m "db: seed de usuarios actualizado"
   git push

Así Javier puede ejecutarlo y tener los mismos datos que tú.

