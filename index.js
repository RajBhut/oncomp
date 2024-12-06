import Docker from "dockerode";
import fs, { unlinkSync } from "fs";

const docker = new Docker();

// const runCode = async (code, language) => {
//   const codefilepath = "./user_code.py";
//   fs.writeFileSync(codefilepath, code);
//   const container = await docker.createContainer({
//     Image: "tesla/python-runner",
//     Tty: false,
//     Cmd: ["python3", "-c", code],
//   });
//   await container.start();
//   const stream = await container.logs({
//     stdout: true,
//     stderr: true,
//     follow: true,
//   });
//   stream.on("data", (chunk) => {
//     console.log(chunk.toString("utf8").trim());
//   });

//   await container.stop();
//   await container.remove();
//   unlinkSync(codefilepath);
// };

// runCode("print('by, World!')", "python");
const runCode = async (code, testCases) => {
  const wrappedCode = `${code.trim()}

 # Test cases runner
test_cases = ${JSON.stringify(testCases)}
for test in test_cases:
    nums, target = test['input']
    try:
        result = twoSum(nums, target)
        print(f"Test Case:")
        print(f"Input: nums={nums}, target={target}")
        print(f"Output: {result}")
        print(f"Expected: {test['expected']}")
        print(f"{'✓ Passed' if result == test['expected'] else '✗ Failed'}")
    except Exception as e:
        print(f"Error: {str(e)}")
    print("-" * 40)`;

  const container = await docker.createContainer({
    Image: "tesla/python-runner",
    Tty: false,
    Cmd: ["python3", "-c", wrappedCode],
  });

  try {
    await container.start();
    const stream = await container.logs({
      stdout: true,
      stderr: true,
      follow: true,
    });

    stream.on("data", (chunk) => {
      console.log(chunk.toString("utf8").trim());
    });

    await container.stop();
  } catch (error) {
    console.error("Execution error:", error);
  } finally {
    await container.remove();
  }
};

const code = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`;

const testCases = [
  {
    input: [[2, 7, 11, 15], 9],
    expected: [0, 1],
  },
  {
    input: [[3, 2, 4], 6],
    expected: [1, 2],
  },
];

runCode(code, testCases);
