import { dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { promisify } from "util";
import { exec } from "child_process";

export function getDirname(importMetaUrl: string) {
  return dirname(getFilename(importMetaUrl));
}

export function getFilename(importMetaUrl: string) {
  return fileURLToPath(importMetaUrl);
}

/**
 * 生成一个随机的 UUID v4
 * @returns {string} 格式如：550e8400-e29b-41d4-a716-446655440000
 */
export function getUUID(): string {
  return randomUUID();
}

const execAsync = promisify(exec); // 将exec转换成返回promise的函数

export async function runCommand(cmd: string, cwd: string) {
  try {
    const stdout = await execAsync(cmd, {
      cwd,
      encoding: "utf-8",
    });
    return stdout.stdout.toString();
  } catch (error: unknown) {
    const err = error as { stdout?: Buffer };
    if (err.stdout) {
      return err.stdout.toString();
    }
    throw error;
  }
}
