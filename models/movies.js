import { readJSON } from "../utils/utils.js";
import { randomUUID } from "node:crypto";
const movies = readJSON("../movies.json");
export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      return movies.filter((movie) => movie.genre.includes(genre));
    }
    return movies;
  };
  static async getById({ id }) {
    const movie = movies.find((movie) => movie.id == id);
    return movie;
  }
  static async create(input) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    };
    movies.push(newMovie);
    return newMovie;
  }
  static async delete({ id }) {
    const deletingIndex = movies.findIndex((movie) => movie.id === id);
    if (deletingIndex === -1) {
      return false;
    }
    movies.splice(deletingIndex, 1);
    return true;
  }
  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id == id);

    const updatedMovie = {
      ...movies[movieIndex],
      ...input,
    };
    movies[movieIndex] = updatedMovie;
    return updatedMovie;
  }
}
