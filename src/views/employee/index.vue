<template>
  <div class="flex">
    <div class="ml-20">
      <el-input v-model="input" clearable placeholder="员工姓名,enter确认" class="mb-20 w-240" @change="inputChange"></el-input>
      <el-tree ref="treeRef" :data="treeData" node-key="id" :current-node-key="currentNodeId" default-expand-all
        highlight-current :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>

    </div>
    <div class="flex-1 mr-20 mb-20">
      <div class="flex" style="gap:0 20px;justify-content: flex-end;">
        <el-button type="primary">添加员工</el-button>
        <el-button>excel导入</el-button>
        <el-button>excel导出</el-button>
      </div>
      <VTable v-bind="tableObj" @fetchTableData="fetchTableData">
        <template v-slot:staffPhoto="{row}">
           <el-avatar :src="row.staffPhoto">{{ !row.staffPhoto?row.username?.[2]:'' }}</el-avatar>
        </template>
      </VTable>

    </div>
  </div>
</template>

<script>
import { buildTreeOptimized } from '@/utils/share'
import { genTableColumn } from '@/utils/genTableDColumn'
export default {
  name: 'employee',
  data() {
    return {
      input: '',
      treeData: [],
      currentNodeId: null,
      tableObj: {
        tableData: [],
        tableColumn: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        payload: {
          showIndex: true,
          showPagination: true,
          paginationPosition: 'right',
          isSingleChoiceTable: false,
          isMultiChoiceTable: false,
        }

      }

    };
  },
  beforeCreate(){
    this.departmentList=[]
  },

  mounted() {
    this.tableObj.tableColumn = genTableColumn('员工首页列表')
    this.$getData('/company/department').then(r => {
      this.departmentList=r
      this.treeData = Object.freeze(buildTreeOptimized(r))
      this.currentNodeId = this.treeData[0].id
      this.$nextTick(() => {
        this.$refs.treeRef.setCurrentKey(this.currentNodeId)
        this.fetchTableData()
      })


    })
  },
  methods: {
    handleNodeClick(data) {
      this.currentNodeId = data.id
      this.tableObj.pagination.currentPage=1
      this.tableObj.pagination.pageSize=10
      this.fetchTableData()
    },
    fetchTableData() {
      const params={
        page:this.tableObj.pagination.currentPage,
        pagesize:this.tableObj.pagination.pageSize,
        keyword:this.input,
        departmentId:this.currentNodeId
      }
      this.$getData('/sys/user',{params}).then(r=>{
        r.rows.forEach(item=>{
          item.departmentIdCn=this.departmentList.find(v=>v.id===item.departmentId)?.name
          item.formOfEmploymentCn=item.formOfEmployment==1?'正式':'非正式'
        })
        
        this.tableObj.tableData=Object.freeze(r.rows)
        this.tableObj.pagination.total=r.total
      })
    },
    inputChange(){
      this.tableObj.pagination.currentPage=1
      this.tableObj.pagination.pageSize=10
      this.fetchTableData()
    }
  },
  watch: {},
};
</script>

<style lang="scss" scoped></style>