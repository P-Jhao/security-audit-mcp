import { normalizeAuditResult } from "./normalizeAuditResult";
import { npmAudit } from "./npmAudit";

export async function audit(workDirPath: string, packageJson: object) {
  // 1. 调用npm audit获取审计结果
  const auditResult = await npmAudit(workDirPath);
  // 2. 规范化审计结果
  const normalizeResult = normalizeAuditResult(auditResult);
}
