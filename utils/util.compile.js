import Docker from "dockerode";
import { python_container_config, PYTHON_BAN_KEYWORDS } from "./consts.js";
const docker = new Docker();

const run_python_code = async (code) => {
  if (!code || typeof code !== "string") {
    console.log("Invalid code input");
    throw new Error("Invalid code input");
  }

  if (PYTHON_BAN_KEYWORDS.some((keyword) => code.includes(keyword))) {
    throw new Error("Security violation: Prohibited code detected");
  }

  const container = await docker.createContainer(python_container_config(code));
  await container.start();
  const stream = await container.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });
  let out = "";
  stream.on("data", (chunk) => {
    out += chunk.toString("utf8").trim();
  });

  await container.stop();
  await container.remove();
  return out;
};

export { run_python_code };
