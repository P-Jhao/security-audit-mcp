export interface AuditResultType {
  vulnerabilities: {
    [key: string]: PackageInfoType;
  };
}

export interface PackageInfoType {
  //包名称
  name: string;
  //漏洞等级
  severity: string;
  //该包的所在位置
  nodes: any[];
  // via代表，经过什么才有漏洞的，也就是说漏洞是怎么来的
  //为字符串时，则漏洞来源于其他依赖
  //为对象时，则来源于自身
  via: any[];
  //会影响到什么包，也就是说什么包依赖了这个包
  effects: string[];
}

/**
 * 给定图结构中的一个节点，获取从该节点的依赖节点出发一直走到终点，一共走出的所有链条
 * 注意：图结构中可能存在环，遇到环时，环所在的节点直接作为终点即可
 * @param {Node} node
 * @returns {Array<Set<string>>} 返回所有依赖链，每个链是一个字符串集合，每个字符串是一个节点名称
 */
export function getDepChains(node: PackageInfoType, globalNodeMap: object) {
  // 存储所有找到的依赖链
  const chains: any[] = [];

  // 当前DFS路径（用于检测环）
  const currentPath: Array<string> = [];

  // 处理当前节点
  function dfs(currentNode: PackageInfoType) {
    if (!currentNode) return;

    // 检查是否已经出现过
    if (currentPath.includes(currentNode.name)) {
      chains.push([...currentPath]);
      return;
    }

    //将当前节点存入路径
    currentPath.unshift(currentNode.name);

    // 如果没有依赖节点，则到达终点
    if (!currentNode.effects || !currentNode.effects.length) {
      chains.push([...currentPath]);
    } else {
      // 递归处理所有依赖节点
      for (const effect of currentNode.effects) {
        dfs(globalNodeMap[effect]);
      }
    }

    //回溯，删除当前节点
    currentPath.shift();
  }
  dfs(node);
  return chains;
}
