import { render } from "../index";
import { getDirname } from "../../utils";
import { join } from "path";
import fs from "fs";

const workDir = join(getDirname(import.meta.url), "./workdir");
const auditResultJson = join(workDir, "./auditResult.json");
const indexJson = join(workDir, "./index.md");
const packageJsonPath = join(workDir, "./package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const auditResult = JSON.parse(fs.readFileSync(auditResultJson, "utf8"));
const templatePath = join(getDirname(import.meta.url), "../template/index.ejs");
async function test() {
  const result = await render(auditResult, packageJson);
  fs.writeFileSync(indexJson, result as any, "utf8");
  console.log("ok");
}

// 监听文件变化
fs.watch(templatePath, (eventType) => {
  if (eventType === "change") {
    console.log(`模板文件发生了变化，重新运行测试函数`);
    test(); // 触发函数
  }
});

// 先执行一次测试
test();

console.log(`已开始监听文件: ${templatePath}`);
