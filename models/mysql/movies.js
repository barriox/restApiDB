import mysql from "mysql2/promise";
import crypto from "node:crypto";
const DEFAULT_CONFIG = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "movies-database",
};
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;
const connection = await mysql.createConnection(connectionString);

export class MovieModel {
  static async getAll({ genre }) {
    try {
      if (!genre) {
        const [movies] = await connection.query(
          "SELECT title, year, duration, poster, rate, bin_to_uuid(id) id FROM movie;"
        );
        return movies;
      }
      const [moviesByGenre] = await connection.query(
        "SELECT bin_to_uuid(movie.id) id, movie.title, movie.year, movie.duration, movie.poster, movie.rate, genre.name FROM movie JOIN movie_genres ON movie.id = movie_genres.movie_id JOIN genre ON movie_genres.genre_id = genre.id WHERE movie.id=(SELECT movie_id FROM movie_genres WHERE genre_id=(SELECT id FROM genre WHERE name=?));",
        [genre]
      );
      if (moviesByGenre.length < 1) {
        throw new Error("Genre not found");
      }
      return moviesByGenre;
    } catch (e) {
      console.log(e.message);
    }
  }

  static async getById({ id }) {
    try {
      const [movie] = await connection.query(
        "SELECT bin_to_uuid(movie.id) id, movie.title, movie.year, movie.duration, movie.poster, movie.rate, genre.name FROM movie JOIN movie_genres ON movie.id = movie_genres.movie_id JOIN genre ON movie_genres.genre_id = genre.id WHERE movie.id=uuid_to_bin(?)",
        [id]
      );
      if (movie.length !== 1) {
        throw new Error("Movie not found");
      }
      return movie;
    } catch (e) {
      console.log(e.message);
    }
  }

  static async create({ input }) {
    const idMovie = crypto.randomBytes(16).toString("hex");
    const { title, year, duration, director, poster, rate, genre } = input;
    try {
      await connection.beginTransaction();
      await connection.execute(`INSERT INTO movie VALUES (?,?,?,?,?,?,?);`, [
        idMovie,
        title,
        year,
        director,
        duration,
        poster,
        rate,
      ]);
      await connection.execute(
        `INSERT INTO movie_genres VALUES (?,(SELECT id FROM genre WHERE name=?));`,
        [idMovie, ...genre]
      );
      await connection.commit();
      return { message: "Movie created" };
    } catch (err) {
      await connection.rollback();
      throw new Error("Error creating the movie");
    }
  }
  static async update({ id, input }) {
    try {
      await connection.beginTransaction();
      const movieToUpdate = await connection.query(
        `SELECT * FROM  movie WHERE id=?`,
        [id]
      );
      if (movieToUpdate[0].length == 0) {
        throw new Error("Movie to update not found");
      }
      const updatedMovie = movieToUpdate[0].map((object) => {
        const movie = { ...object, ...input };
        return movie;
      });
      await connection.execute(
        `UPDATE movie SET title=?, year=?, director=?, duration=?, poster=?, rate=? WHERE id=?`,
        [
          updatedMovie[0].title,
          updatedMovie[0].year,
          updatedMovie[0].director,
          updatedMovie[0].duration,
          updatedMovie[0].poster,
          updatedMovie[0].rate,
          id,
        ]
      );
      await connection.commit();
      return { message: "Movie updated" };
    } catch (e) {
      await connection.rollback();
    }
  }
  static async delete({ id }) {
    try {
      await connection.beginTransaction();
      const [movie] = await connection.query("SELECT * FROM movie WHERE id=?", [
        id,
      ]);
      if (!movie.length) {
        throw new Error("Movie to delete not found");
      }
      await connection.execute("DELETE FROM movie WHERE id=?", [id]);
      await connection.commit();
      return { message: "Movie deleted" };
    } catch (e) {
      await connection.rollback();
      console.log(e.message);
    }
  }
}
