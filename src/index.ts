require("dotenv").config();
import express from "express";
import router from "./routes";
import { initDb } from "./services/db";
import { initRepositoryWatcher } from "./services/repositoryWatcher";

initDb();
initRepositoryWatcher();

const app = express();

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use("/", router);

const port = process.env["PORT"] || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
