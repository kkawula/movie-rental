import mountRoutes from "./routes/index";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

mountRoutes(app);

app.get("/", function (req, res) {
  res.send("Hello world!");
});

app.listen(3001);
