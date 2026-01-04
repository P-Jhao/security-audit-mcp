import { currentAudit } from "./currentAudit.js";
import { normalizeAuditResult } from "./normalizeAuditResult.js";
import { npmAudit } from "./npmAudit.js";

export async function audit(workDirPath: string, packageJson: any) {
  // 1. 调用npm audit获取审计结果
  const auditResult = await npmAudit(workDirPath);
  // 2. 规范化审计结果
  const normalizeResult = normalizeAuditResult(auditResult);

  // 添加当前工程的审计结果（针对fork）
  const current = await currentAudit(packageJson.name, packageJson.version);
  if (current) {
    (normalizeResult.vulnerabilities as Record<string, any[]>)[
      current.severity
    ].unshift(current);
  }
  // 添加汇总信息
  normalizeResult.summary = {
    total: Object.values(normalizeResult.vulnerabilities).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
    critical: normalizeResult.vulnerabilities.critical.length,
    high: normalizeResult.vulnerabilities.high.length,
    moderate: normalizeResult.vulnerabilities.moderate.length,
    low: normalizeResult.vulnerabilities.low.length,
  };
  return normalizeResult;
}
