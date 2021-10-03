require("dotenv").config();
import express from "express";
import router from "./routes";
import { initDb } from "./services/db";
import { initRepositoryWatcher } from "./services/repositoryWatcher";

initDb();
initRepositoryWatcher();

const app = express();

app.use(express.json());

app.use("/", router);
app.listen(5000);
