import { Router } from "express";
import { runCode_problem } from "../services/problem.js";

const router = Router();

router.post("/prob", async (req, res) => {
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

export default router;
