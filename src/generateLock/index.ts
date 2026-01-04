import fs from "node:fs";
import path from "node:path";
import { runCommand } from "../utils/index.js";

async function writePackageJson(workDirPath: string, packageJson: object) {
  const packageJsonPath = path.join(workDirPath, "package.json");
  await fs.promises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson),
    "utf-8"
  );
}

async function createLockFile(workDirPath: string) {
  const cmd = `npm install --package-lock-only --force`;
  await runCommand(cmd, workDirPath);
}

export async function generateLock(workDirPath: string, packageJson: object) {
  // 将package.json文件写入工作目录
  await writePackageJson(workDirPath, packageJson);
  //生成lock文件
  await createLockFile(workDirPath);
}
