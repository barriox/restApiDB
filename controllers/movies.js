import { MovieModel } from "../models/movies.js";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";
export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    res.json(movies);
  }
  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (movie) res.json(movie);
    res.status(404).json({ message: "Movie not found!" });
  }
  static async create(req, res) {
    const result = validateMovie(req.body);
    if (result.error) {
      res.status(400).json(JSON.parse(result.error.message));
    }
    const newMovie = await MovieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  }
  static async update(req, res) {
    const result = validatePartialMovie(req.body);
    if (result.error) {
      res.status(400).json(JSON.parse(result.error.message));
    }
    const { id } = req.params;
    const updatedMovie = await MovieModel.update({ id, input: result.data });
    res.json(updatedMovie);
  }
  static async delete(req, res) {
    const { id } = req.params;
    const eliminated = await MovieModel.delete({ id });
    res.json(eliminated);
  }
}
