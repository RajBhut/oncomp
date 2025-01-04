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
    Image: "python:3.9-slim",
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

export { PYTHON_BAN_KEYWORDS, python_container_config };
