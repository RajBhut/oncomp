const PYTHON_BAN_KEYWORDS = [
  "import os",
  "import sys",
  "import subprocess",
  "open(",
  "exec(",
  "eval(",
  "__import__",
  "system",
];

const python_container_config = (wrappedCode) => {
  return {
    Image: "python:3.9-alpine",
    Tty: true,
    Cmd: ["python3", "-c", wrappedCode],
    HostConfig: {
      Memory: 50 * 1024 * 1024,
      MemorySwap: -1,
      NetworkMode: "none",
      SecurityOpt: ["no-new-privileges"],
      ReadonlyRootfs: true,
    },
    StopTimeout: 3,
  };
};

const java_container_config = (wrappedCode) => {
  const escapedCode = wrappedCode.replace(/"/g, '\\"');
  return {
    Image: "openjdk:11-slim",
    Tty: true,
    Cmd: [
      "sh",
      "-c",
      `echo "     echo "${escapedCode}" > Solution.java && javac Solution.java && java Solution `,
    ],
    HostConfig: {
      Memory: 50 * 1024 * 1024,
      MemorySwap: -1,
      NetworkMode: "none",
      SecurityOpt: ["no-new-privileges"],
    },
    StopTimeout: 3,
  };
};

const cpp_container_config = (wrappedCode) => {
  return {
    Image: "gcc:alpine",
    Tty: true,
    Cmd: [
      "sh",
      "-c",
      `echo "${wrappedCode}" > solution.cpp && g++ solution.cpp -o solution && ./solution`,
    ],
    HostConfig: {
      Memory: 50 * 1024 * 1024,
      MemorySwap: -1,
      NetworkMode: "none",
      SecurityOpt: ["no-new-privileges"],
      ReadonlyRootfs: true,
    },
    StopTimeout: 3,
  };
};

const c_container_config = (wrappedCode) => {
  return {
    Image: "gcc:alpine",
    Tty: true,
    Cmd: [
      "sh",
      "-c",
      `echo "${wrappedCode}" > solution.c && gcc solution.c -o solution && ./solution`,
    ],
    HostConfig: {
      Memory: 50 * 1024 * 1024,
      MemorySwap: -1,
      NetworkMode: "none",
      SecurityOpt: ["no-new-privileges"],
      ReadonlyRootfs: true,
    },
    StopTimeout: 3,
  };
};

const js_container_config = (wrappedCode) => {
  return {
    Image: "node:alpinenode:alpine",
    Tty: true,
    Cmd: ["node", "-e", wrappedCode],
    HostConfig: {
      Memory: 50 * 1024 * 1024,
      MemorySwap: -1,
      NetworkMode: "none",
      SecurityOpt: ["no-new-privileges"],
      ReadonlyRootfs: true,
    },
    StopTimeout: 3,
  };
};

export {
  python_container_config,
  java_container_config,
  cpp_container_config,
  c_container_config,
  js_container_config,
  PYTHON_BAN_KEYWORDS,
};
