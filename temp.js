import express from "express";
import {
  run_c_code,
  run_java_code,
  run_js_code,
  run_python_code,
} from "./utils/util.compile.js";
import cors from "cors";
import { runCode_problem } from "./utils/util.prob.js";
import { checkAndPullImage } from "./utils/base.js";
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
await checkAndPullImage("python:3.9-slim");
await checkAndPullImage("openjdk:11-slim");
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/prob", async (req, res) => {
  try {
    let { code, testcase, testcode, language } = req.body;
    console.log(language);
    code = decodeURIComponent(atob(code));
    testcase = decodeURIComponent(atob(testcase));
    testcode = decodeURIComponent(atob(testcode));

    if (!req.body) {
      return res.status(400).send({ error: "Request body is required" });
    }

    const r = await runCode_problem(code, testcase, testcode, language);

    res.status(200).send(r);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/", async (req, res) => {
  try {
    let { code, language } = req.body;

    code = decodeURIComponent(atob(code));
    console.log(language);
    if (!req.body) {
      return res.status(400).send({ error: "Request body is required" });
    }
    let re = null;
    if (language == "java") {
      re = await run_java_code(code);
    } else {
      re = await run_python_code(code);
    }
    res.status(200).send(re);
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
