import mountRoutes from "./routes/index";
import express from "express";

const app = express();

mountRoutes(app);

app.get("/", function (req, res) {
  res.send("Hello world!");
});

app.listen(3001);
