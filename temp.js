import express from "express";
import { run_python_code } from "./utils/util.compile.js";
import cors from "cors";
import { runCode_problem } from "./utils/util.prob.js";
import { checkAndPullImage } from "./utils/base.js";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
checkAndPullImage("python:3.9-slim");
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/prob", async (req, res) => {
  try {
    let { code, testcase, testcode } = req.body;

    code = decodeURIComponent(atob(code));

    testcase = decodeURIComponent(atob(testcase));
    testcode = decodeURIComponent(atob(testcode));

    // code = atob(code);
    // testcase = atob(testcase);
    // testcode = atob(testcode);

    if (!req.body) {
      return res.status(400).send({ error: "Request body is required" });
    }

    const r = await runCode_problem(code, testcase, testcode);

    res.status(200).send(r);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/", async (req, res) => {
  try {
    let { code } = req.body;

    code = atob(code);
    console.log(code);
    if (!req.body) {
      return res.status(400).send({ error: "Request body is required" });
    }

    const r = await run_python_code(code);

    res.status(200).send(r);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log(
    "Server is running on port 3000 \n --------------------------------------------------------------------------------------------------"
  );
});
