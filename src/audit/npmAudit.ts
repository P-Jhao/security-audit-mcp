import { runCommand } from "../utils";

export async function npmAudit(workDirPath: string) {
  // 强制使用官方 npm registry，因为镜像源不支持 audit API
  const cmd = `npm audit --json --registry=https://registry.npmjs.org`;
  const jsonResult = await runCommand(cmd, workDirPath);
  const auditData = JSON.parse(jsonResult);
  return auditData;
}
