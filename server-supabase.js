import { createApp } from "./app.js";
import { MovieModel } from "./models/supabase/movies.js";
createApp({ movieModel: MovieModel });
