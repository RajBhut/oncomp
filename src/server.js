import express from "express";
import cors from "cors";
import { checkAndPullImage } from "./services/docker.js";
import compileRouter from "./routes/compile.js";
import problemRouter from "./routes/problem.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://oncomp.rajb.codes",
      "https://on-comp-frontend.vercel.app",
    ],
  })
);
app.use(express.json());

await checkAndPullImage("python:3.9-alpine");
await checkAndPullImage("openjdk:11-slim");
await checkAndPullImage("node:alpine");

setInterval(async () => {
  await checkAndPullImage("python:3.9-alpine");
  await checkAndPullImage("openjdk:11-slim");
  await checkAndPullImage("node:alpine");
}, 1000 * 60 * 28);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(compileRouter);
app.use(problemRouter);

app.listen(3000, () => {
  console.log(
    "Server is running on port 3000 \n --------------------------------------------------------------------------------------------------"
  );
});
