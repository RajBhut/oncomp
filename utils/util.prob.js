import Docker from "dockerode";

const docker = new Docker();

import {
  PYTHON_BAN_KEYWORDS,
  python_container_config,
  java_container_config,
  js_container_config,
  c_container_config,
  cpp_container_config,
} from "./consts.js";

const runCode_problem = async (code, testCases, testcode, language) => {
  if (!code || typeof code !== "string") {
    throw new Error("Invalid code input");
  }
  if (language === "python") {
    if (PYTHON_BAN_KEYWORDS.some((keyword) => code.includes(keyword))) {
      throw new Error("Security violation: Prohibited code detected");
    }
  }

  const wrappedCode = `${code.trim()}


test_cases = ${testCases}



${testcode}`;

  let conf = python_container_config(wrappedCode);
  if (language === "python") {
    conf = python_container_config(wrappedCode);
  } else if (language === "java") {
    conf = java_container_config(wrappedCode);
  } else if (language === "js") {
    conf = js_container_config(wrappedCode);
  } else if (language === "c") {
    conf = c_container_config(wrappedCode);
  } else if (language === "cpp") {
    conf = cpp_container_config(wrappedCode);
  }

  const container = await docker.createContainer(conf);
  let out = "";
  try {
    await container.start();
    const stream = await container.logs({
      stdout: true,
      stderr: true,
      follow: true,
    });

    stream.on("data", (chunk) => {
      out += chunk.toString("utf8").trim();
    });
  } catch (error) {
    console.error("Execution error:", error);
  } finally {
    await container.stop();
    await container.remove();
    return out;
  }
};
// const code = `def twoSum(nums, target):
//     seen = {}
//     for i, num in enumerate(nums):
//         complement = target - num
//         if complement in seen:
//             return [seen[complement], i]
//         seen[num] = i
//     return []`;
export { runCode_problem };
