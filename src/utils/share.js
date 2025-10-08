export const buildTreeOptimized = (data) => {
  const map = new Map();
  const tree = [];

  // 首先将所有节点存入map
  data.forEach(item => {
    item.label = item.name
    map.set(item.id, { ...item, children: [] });
  });

  // 构建树形结构
  map.forEach(item => {
    if (item.pid === 0) {
      tree.push(item);
    } else {
      const parent = map.get(item.pid);
      if (parent) {
        parent.children.push(item);
      }
    }
  });

  return tree;
}
