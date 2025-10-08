const r = [
  {
    "id": 1,
    "pid": 0,
    "name": "传智教育",
    "code": "CZJY",
    "managerId": 1,
    "managerName": "管理员",
    "introduce": "总部",
    "createTime": "2022-10-26 09:13:37"
  },
  {
    "id": 2,
    "pid": 1,
    "name": "总裁办",
    "code": "ZCB",
    "managerId": 1,
    "managerName": "管理员",
    "introduce": "公司战略部",
    "createTime": "2022-10-26 09:13:37"
  },
  {
    "id": 3,
    "pid": 1,
    "name": "行政部",
    "code": "XZB",
    "managerId": 4,
    "managerName": "黑马文吉星",
    "introduce": "行政部",
    "createTime": "2022-10-26 09:13:39"
  },
  {
    "id": 4,
    "pid": 1,
    "name": "人事部",
    "code": "RSB",
    "managerId": 8,
    "managerName": "黑马周乐天",
    "introduce": "人事部",
    "createTime": "2022-10-26 09:13:42"
  },
  {
    "id": 5,
    "pid": 1,
    "name": "财务部",
    "code": "CWB",
    "managerId": 5,
    "managerName": "黑马巴思慧",
    "introduce": "财务部",
    "createTime": "2022-10-26 09:13:40"
  },
  {
    "id": 6,
    "pid": 1,
    "name": "技术部",
    "code": "JSB",
    "managerId": 11,
    "managerName": "黑马罗英卓",
    "introduce": "技术部",
    "createTime": "2022-10-26 09:13:44"
  },
  {
    "id": 7,
    "pid": 1,
    "name": "运营部",
    "code": "YYB",
    "managerId": 2,
    "managerName": "黑马孙财",
    "introduce": "运营部",
    "createTime": "2022-10-26 09:13:38"
  },
  {
    "id": 8,
    "pid": 1,
    "name": "市场部",
    "code": "SCB",
    "managerId": 7,
    "managerName": "黑马董昊空",
    "introduce": "市场部",
    "createTime": "2022-10-26 09:13:42"
  },
  {
    "id": 9,
    "pid": 4,
    "name": "财务核算部",
    "code": "CWHSB",
    "managerId": 9,
    "managerName": "黑马吕勇锐",
    "introduce": "财务核算部",
    "createTime": "2022-10-26 09:13:43"
  },
  {
    "id": 10,
    "pid": 4,
    "name": "税务管理部",
    "code": "SWGLB",
    "managerId": 5,
    "managerName": "黑马巴思慧",
    "introduce": "税务管理部",
    "createTime": "2022-10-26 09:13:40"
  },
  {
    "id": 11,
    "pid": 4,
    "name": "薪资管理部",
    "code": "XZGLB",
    "managerId": 3,
    "managerName": "黑马罗晓晓",
    "introduce": "薪资管理部",
    "createTime": "2022-10-26 09:13:39"
  },
  {
    "id": 14,
    "pid": 5,
    "name": "PHP研发部",
    "code": "PHYSB",
    "managerId": 10,
    "managerName": "黑马袁永安",
    "introduce": "PHP研发部",
    "createTime": "2022-10-26 09:13:44"
  },
  {
    "id": 15,
    "pid": 7,
    "name": "上海事业部",
    "code": "SHSYB",
    "managerId": 6,
    "managerName": "黑马乔海",
    "introduce": "上海事业部",
    "createTime": "2022-10-26 09:13:41"
  },
  {
    "id": 16,
    "pid": 7,
    "name": "北京事业部",
    "code": "BJSYB",
    "managerId": 16,
    "managerName": "黑马瞿光明",
    "introduce": "北京事业部",
    "createTime": "2022-10-26 09:13:48"
  }
]
function buildTreeOptimized(data) {
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

const treeData2 = buildTreeOptimized(r);
console.log(treeData2);