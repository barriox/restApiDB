import express, { json } from "express";
import { moviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

const app = express();
app.disabled("x-powered-by");
app.use(json());
app.use(corsMiddleware());

app.use("/movies", moviesRouter); //each time express detects a request to /movie  it will use the router in moviesRouter

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
