import { Router } from "express";
import {
  run_java_code,
  run_js_code,
  run_python_code,
} from "../services/compiler.js";

const router = Router();

router.post("/", async (req, res) => {
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
    } else if (language == "javascript") {
      re = await run_js_code(code);
    } else {
      re = await run_python_code(code);
    }

    res.status(200).send(re);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
