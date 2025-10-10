const map={
    '员工首页列表':Object.freeze([
      {prop:'staffPhoto',label:'头像',align:'center',slotName:'staffPhoto'},
      {prop:'username',label:'姓名',align:'center'},
      {prop:'mobile',label:'手机号',align:'center'},
      {prop:'formOfEmploymentCn',label:'聘用形式',align:'center'},
      {prop:'departmentIdCn',label:'部门',align:'center'},
      {prop:'timeOfEntry',label:'入职时间',align:'center'},
      {prop:'opt',label:'操作',align:'center',slotName:'opt'}
    ])
}

export const genTableColumn=key=>map[key]

/*

{
    "id": 1,
    "username": "管理员",
    "staffPhoto": "https://heimahr.itheima.net/defaultHead.png",
    "mobile": "13800000002",
    "workNumber": "HEIMA00001",
    "departmentId": 1,
    "departmentName": "传智教育",
    "timeOfEntry": "2022-10-24",
    "formOfEmployment": 1
}
*/