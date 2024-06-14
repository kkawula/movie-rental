import { Express } from "express";

import movies from "./movies";
import genres from "./genres";
import dvds from "./dvds";
import users from "./users";
import rentals from "./rentals";
import rentalsHistory from "./rentalsHistory";
import moviesReport from "./moviesReport"
import genresReport from "./genresReport"

const mountRoutes = (app: Express) => {
  app.use("/movies", movies);
  app.use("/genres", genres);
  app.use("/dvds", dvds);
  app.use("/users", users);
  app.use("/rentals", rentals);
  app.use("/rentals_history", rentalsHistory);
  app.use("/movies_report", moviesReport);
  app.use("/genres_report", genresReport);
};

export default mountRoutes;
