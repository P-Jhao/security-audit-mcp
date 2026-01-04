import { remoteAudit } from "./remoteAudit.js";

type SeverityLevel = "info" | "low" | "moderate" | "high" | "critical";

const severityLevelsMap: Record<SeverityLevel, number> = {
  info: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

export async function currentAudit(name: string, version: string) {
  // 1. 调用 remoteAudit 函数获取审计结果
  const auditResult = await remoteAudit(name, version);

  // 2. 规格化审计结果
  if (
    !auditResult.advisories ||
    Object.keys(auditResult.advisories).length === 0
  ) {
    return null;
  }

  const result = {
    name,
    range: version,
    nodes: ["."],
    depChains: [],
    problems: [] as any[],
    severity: "info",
  };
  const advisories = Object.values(auditResult.advisories);
  let maxSeverity = "info";
  result.problems = advisories.map((advisory: any) => {
    const problem = {
      source: advisory.id,
      name,
      dependency: name,
      title: advisory.title,
      url: advisory.url,
      severity: advisory.severity,
      cwe: advisory.cwe,
      cvss: advisory.cvss,
      range: advisory.vulnerable_versions,
    };
    // 更新最大严重性
    if (
      severityLevelsMap[problem.severity as SeverityLevel] >
      severityLevelsMap[maxSeverity as SeverityLevel]
    ) {
      maxSeverity = problem.severity;
    }
    return problem;
  });
  result.severity = maxSeverity;
  return result;
}
