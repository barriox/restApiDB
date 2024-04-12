import { validateMovie, validatePartialMovie } from "../schemas/movies.js";
export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }
  getAll = async (req, res) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({ genre });
    if (genre && !movies) res.status(404).json({ message: "Genre not found!" });
    res.json(movies);
  };
  getById = async (req, res) => {
    const { id } = req.params;
    const movie = await this.movieModel.getById({ id });
    if (!movie) res.status(404).json({ message: "Movie not found!" });
    res.json(movie);
  };
  create = async (req, res) => {
    const result = validateMovie(req.body);
    if (result.error) {
      return res.status(400).json(JSON.parse(result.error.message));
    }
    const newMovie = await this.movieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  };
  update = async (req, res) => {
    const result = validatePartialMovie(req.body);
    if (result.error) {
      res.status(400).json(JSON.parse(result.error.message));
    }
    const { id } = req.params;
    const updatedMovie = await this.movieModel.update({
      id,
      input: result.data,
    });
    if (!updatedMovie)
      res.status(404).json({ message: "Movie to update not found!" });
    res.json(updatedMovie);
  };
  delete = async (req, res) => {
    const { id } = req.params;
    const eliminated = await this.movieModel.delete({ id });
    if (!eliminated)
      res.status(404).json({ message: "Movie to delete not found!" });
    res.json(eliminated);
  };
}
