interface GitInfo {
  owner: string;
  repo: string;
  path: string;
}

/**
 * 解析 GitHub 仓库 URL，提取 owner、repo 和后续路径
 * 支持格式：
 *   - https://github.com/owner/repo
 *   - https://github.com/owner/repo/tree/branch
 *   - https://github.com/owner/repo/blame/...
 *   等等
 *
 * @param {string} url - GitHub 仓库 URL
 * @returns {Object} { owner, repo, path }
 * @throws {Error} 如果 URL 格式不合法或无法解析
 */
function parseGithubUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    //确保是github中的地址
    if (parsedUrl.hostname !== "github.com") {
      throw Error("Only github.com URLs are supported");
    }

    // 获取路径并去除空字符串（如开头的 /）
    const parts = parsedUrl.pathname.split("/").filter(Boolean);

    // 至少需要owner和repo两段
    if (parts.length < 2) {
      throw new Error(
        "Invalid GitHub repository URL: insufficient path segments"
      );
    }

    const owner = parts[0];
    const repo = parts[1];
    const restPath = parts.slice(2); // 剩余路径，如["tree", "v5.2.2"]

    // 构造path
    const path = restPath.length > 0 ? "/" + restPath.join("/") : "";

    return { owner, repo, path };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Invalid URL: malformed or missing");
    }
    throw error;
  }
}

async function getPackageJsonUrl({ owner, repo, path }: GitInfo) {
  if (path.startsWith("/tree/")) {
    const pathParts = path.split("/").filter(Boolean);
    const ref = pathParts[1];
    // 先尝试作为分支，失败再尝试作为 tag
    const headsUrl = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${ref}/package.json`;
    const tagsUrl = `https://raw.githubusercontent.com/${owner}/${repo}/refs/tags/${ref}/package.json`;

    const headsRes = await fetch(headsUrl, { method: "HEAD" });
    if (headsRes.ok) {
      return headsUrl;
    }
    return tagsUrl;
  } else {
    // 默认分支，通过 API 获取
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`GitHub API 请求失败: ${res.status} ${res.statusText}`);
    }
    const info = await res.json();
    const branch = info.default_branch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/package.json`;
  }
}

export async function parseRemoteProject(githubUrl: string) {
  const gitInfo = parseGithubUrl(githubUrl);
  const packageJsonUrl = await getPackageJsonUrl(gitInfo);
  const res = await fetch(packageJsonUrl);
  if (!res.ok) {
    throw new Error(
      `获取 package.json 失败: ${res.status} ${res.statusText}\nURL: ${packageJsonUrl}`
    );
  }
  return await res.json();
}
