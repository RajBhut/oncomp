import Docker from "dockerode";

const docker = new Docker();
import { PYTHON_BAN_KEYWORDS, python_container_config } from "./consts.js";
const runCode = async (code, testCases, language) => {
  if (!code || typeof code !== "string") {
    throw new Error("Invalid code input");
  }

  if (PYTHON_BAN_KEYWORDS.some((keyword) => code.includes(keyword))) {
    throw new Error("Security violation: Prohibited code detected");
  }

  const wrappedCode = `${code.trim()}


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

  const container = await docker.createContainer(
    python_container_config(wrappedCode)
  );

  try {
    await container.start();
    const stream = await container.logs({
      stdout: true,
      stderr: true,
      follow: true,
    });

    stream.on("data", (chunk) => {
      const cleanOutput = chunk.toString("utf8").trim();
      if (cleanOutput) console.log(cleanOutput);
    });
  } catch (error) {
    console.error("Execution error:", error);
  } finally {
    await container.stop();
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