import { Express } from "express";

import movies from "./movies";

const mountRoutes = (app: Express) => {
  app.use("/movies", movies);
};

export default mountRoutes;
