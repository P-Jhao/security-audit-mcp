import { parseLocalProject } from "./parseLocalProject.js";
import { parseRemoteProject } from "./parseRemoteProject.js";

/**
 * 解析工程根目录下的package.json文件
 * @param {string} projectRoot 工程本地的根目录或远程仓库的URL
 * @example
 * parseProject('/path/to/local/project');
 * parseProject('https://github.com/webpack/webpack');
 * @returns {Promise<Object>} 返回解析后的package.json内容
 * @throws {Error} 如果解析失败或文件不存在
 */
export async function parseProject(projectRoot: string) {
  if (projectRoot.startsWith("http://") || projectRoot.startsWith("https://")) {
    //是远程仓库URL
    return parseRemoteProject(projectRoot);
  }
  return parseLocalProject(projectRoot);
}
