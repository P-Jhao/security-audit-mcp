import { renderMarkdown } from "./markdom";

interface AuditResult {
  summary: any;
  vulnerabilities: {
    critical: any[];
    high: any[];
    moderate: any[];
    low: any[];
  };
}

const desc = {
  severityLevels: {
    low: "低危",
    moderate: "中危",
    high: "高危",
    critical: "严重",
  },
};

export async function render(auditResult: AuditResult, packageJson: any) {
  const data = {
    audit: auditResult,
    desc,
    packageJson,
  };
  return await renderMarkdown(data);
}
