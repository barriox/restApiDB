import express, { json } from "express";
import { createMovieRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";
import "dotenv/config";

export const createApp = ({ movieModel }) => {
  const app = express();
  app.disabled("x-powered-by");
  app.use(json());
  app.use(corsMiddleware());

  app.use("/movies", createMovieRouter({ movieModel: movieModel }));

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
