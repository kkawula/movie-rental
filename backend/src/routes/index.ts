import { Express } from "express";

import movies from "./movies";
import genres from "./genres";
import dvds from "./dvds";
import users from "./users";

const mountRoutes = (app: Express) => {
  app.use("/movies", movies);
  app.use("/genres", genres);
  app.use("/dvds", dvds);
  app.use("/users", users);
};

export default mountRoutes;
