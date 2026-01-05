import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 部署目录
const deployDir = join(__dirname, "deploy");

// 需要复制的文件和目录
const filesToCopy = ["package.json", "pnpm-lock.yaml", ".gitignore"];

const dirsToCopy = ["dist"];

// 递归复制目录
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

console.log("🚀 开始准备部署文件...");

// 清理并创建部署目录
try {
  execSync(`rmdir /s /q "${deployDir}"`, { stdio: "ignore" });
} catch (e) {
  // 目录不存在，忽略错误
}
mkdirSync(deployDir, { recursive: true });

// 复制文件
for (const file of filesToCopy) {
  const src = join(__dirname, file);
  const dest = join(deployDir, file);
  try {
    copyFileSync(src, dest);
    console.log(`✅ 已复制: ${file}`);
  } catch (e) {
    console.log(`⚠️  跳过: ${file} (不存在)`);
  }
}

// 复制目录
for (const dir of dirsToCopy) {
  const src = join(__dirname, dir);
  const dest = join(deployDir, dir);
  try {
    copyDir(src, dest);
    console.log(`✅ 已复制目录: ${dir}`);
  } catch (e) {
    console.log(`⚠️  跳过目录: ${dir} (不存在)`);
  }
}

console.log("\n✅ 部署文件准备完成！");
console.log(`📦 部署目录: ${deployDir}`);
console.log("\n📝 上传到服务器后，执行以下命令：");
console.log("   pnpm install --prod");
console.log("   node dist/mcpServer.js");
