import express from "express";
import router from "./routes";
import { initDb } from "./db";

initDb();

const app = express();

app.use(express.json());

app.use("/", router);
app.listen(5000);

