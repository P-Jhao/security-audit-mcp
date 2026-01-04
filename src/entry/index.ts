import { audit } from "../audit";
import { generateLock } from "../generateLock";
import { parseProject } from "../parseProject";
import { render } from "../render";
import { createWorkDir, deleteWorkDir } from "../workDir";
import fs from "fs";

/**
 * 根据项目根目录，审计项目中所有的包（含项目本身）
 * @param {string} projectRoot 项目根目录，可以是本地目录的绝对路径，也可以是远程仓库的URL
 * @param {string} savePath 保存审计结果的文件名，审计结果是一个标准格式的markdown字符串
 */
export async function auditPackage(projectRoot: string, savePath: string) {
  // 1. 创建工作目录，用于保存工作期间的临时文件
  const workDirPath = await createWorkDir();
  // 2. 解析项目，向工作目录添加package.json
  const packageJson = await parseProject(projectRoot);
  // 3. 生成package.json和lock文件
  await generateLock(workDirPath, packageJson);
  // 4. 对工作目录进行审计
  const auditResult = await audit(workDirPath, packageJson);
  // 5. 将审计结果渲染成markdom格式
  const renderdResult = await render(auditResult, packageJson);
  // 6. 删除工作目录
  await deleteWorkDir(workDirPath);
  // 7. 将结果保存至指定目录
  await fs.promises.writeFile(savePath, renderdResult as any);
}
