import { Express } from "express";

import movies from "./movies";
import genres from "./genres";

const mountRoutes = (app: Express) => {
  app.use("/movies", movies);
  app.use("/genres", genres);
};

export default mountRoutes;
