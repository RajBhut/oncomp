import Docker from "dockerode";
import stripAnsi from "strip-ansi";
import {
  python_container_config,
  PYTHON_BAN_KEYWORDS,
  java_container_config,
  c_container_config,
  cpp_container_config,
  js_container_config,
} from "./consts.js";
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
    out += chunk.toString("utf8");
  });

  await container.stop();
  await container.remove();
  return out;
};

export { run_python_code };

const run_java_code = async (code) => {
  if (!code || typeof code !== "string") {
    console.log("Invalid code input");
    throw new Error("Invalid code input");
  }

  const container = await docker.createContainer(java_container_config(code));
  await container.start();
  const stream = await container.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });
  let out = "";
  stream.on("data", (chunk) => {
    out += chunk.toString("utf8");
  });

  await container.stop();
  await container.remove();
  return out;
};

export { run_java_code };
const run_js_code = async (code) => {
  if (!code || typeof code !== "string") {
    console.log("Invalid code input");
    throw new Error("Invalid code input");
  }

  const container = await docker.createContainer(js_container_config(code));

  await container.start();

  const stream = await container.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });
  let out = "";
  stream.on("data", (chunk) => {
    out += chunk.toString("utf8");
  });

  await container.stop();
  await container.remove();
  out = stripAnsi(out);
  return out;
};

export { run_js_code };

const run_c_code = async (code) => {
  if (!code || typeof code !== "string") {
    console.log("Invalid code input");
    throw new Error("Invalid code input");
  }

  const container = await docker.createContainer(c_container_config(code));
  await container.start();
  const stream = await container.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });
  let out = "";
  stream.on("data", (chunk) => {
    out += chunk.toString("utf8");
  });

  await container.stop();
  await container.remove();
  return out;
};

export { run_c_code };

const run_cpp_code = async (code) => {
  if (!code || typeof code !== "string") {
    console.log("Invalid code input");
    throw new Error("Invalid code input");
  }

  const container = await docker.createContainer(cpp_container_config(code));
  await container.start();
  const stream = await container.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });
  let out = "";
  stream.on("data", (chunk) => {
    out += chunk.toString("utf8");
  });

  await container.stop();
  await container.remove();
  return out;
};

export { run_cpp_code };
