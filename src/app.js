import express from "express";

const app = express();

app.use(express.static("./src/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import apiRouter from "./routes/api.js";
import viewRouter from "./routes/view.js";

app.use("/", viewRouter);
app.use("/api", apiRouter);

import { engine } from "express-handlebars";

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`app listening on http://localhost:${PORT}`);
});
