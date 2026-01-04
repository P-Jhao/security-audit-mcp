import { currentAudit } from "./currentAudit";
import { normalizeAuditResult } from "./normalizeAuditResult";
import { npmAudit } from "./npmAudit";

export async function audit(workDirPath: string, packageJson: any) {
  // 1. 调用npm audit获取审计结果
  const auditResult = await npmAudit(workDirPath);
  // 2. 规范化审计结果
  const normalizeResult = normalizeAuditResult(auditResult);

  // 添加当前工程的审计结果（针对fork）
  const current = await currentAudit(packageJson.name, packageJson.version);
}
