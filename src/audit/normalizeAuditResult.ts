import {
  getDepChains,
  type PackageInfoType,
  type AuditResultType,
} from "./getDepChains";

function _normalizeVulnerabilities(auditResult: AuditResultType) {
  const result = {
    critical: [],
    high: [],
    moderate: [],
    low: [],
  };
  for (const key in auditResult.vulnerabilities) {
    const packageInfo = auditResult.vulnerabilities[key];
    const normalizePackage = _normalizePackage(packageInfo);
    if (normalizePackage) {
      result[normalizePackage.severity].push(normalizePackage);
    }
  }
  return result;

  function _normalizePackage(packageInfo: PackageInfoType) {
    const { via = [] } = packageInfo;
    //只关注自身的问题，来源于其他包的问题不关注
    const validVia = via.filter((item) => typeof item === "object");
    if (validVia.length === 0) return null;
    const info = {
      name: packageInfo.name,
      severity: packageInfo.severity,
      problems: validVia,
      nodes: packageInfo.nodes || [],
      depChains: getDepChains(packageInfo, auditResult.vulnerabilities),
    };
    return info;
  }
}

export function normalizeAuditResult(auditResult: AuditResultType) {
  return {
    summary: {} as any,
    vulnerabilities: _normalizeVulnerabilities(auditResult),
  };
}
