import express from "express";

const app = express();

app.listen(5000);

app.get("/", (_req, res) => {
  res.send("Hello World");
});
