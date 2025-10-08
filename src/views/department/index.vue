<template>
  <div>
    <el-tree
      :data="treeData"
      default-expand-all
    >
      <template v-slot="{  data }">
        <div class="custom-tree-node">
          <span style="margin-right: 20px;">{{ data.label }}</span>
          <span style="margin-right: 20px;font-size: 14px;">{{ data.managerName }}</span>
          <span>
            <el-button type="text"  @click.stop="handleNodeClick('add',data)"> 添加子部门 </el-button>
            <el-button type="text"  @click.stop="handleNodeClick('edit',data)"> 编辑部门 </el-button>
            <el-button type="text"  @click.stop="handleNodeClick('del',data)"> 删除 </el-button>
          </span>
        </div>
      </template>
    </el-tree>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="closed"
      >
     <el-form  ref="formRef" :model="form" label-width="120px">
      <el-form-item label="部门名称"><el-input v-model="form.name"></el-input></el-form-item>
      <el-form-item label="部门编码"><el-input v-model="form.code"></el-input></el-form-item>
      <el-form-item label="部门负责人">
        <el-select v-model="form.managerId" placeholder="请选择部门负责人">
          <el-option v-for="item in fzrOptions" :key="item.id" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import {buildTreeOptimized} from '@/utils/share'
export default {
  name: "department",
  data() {
    return {
      treeData:[],
      fzrOptions:[],
      title:'',
      dialogVisible:false,
      form:{
        name:'', //名称 比如 行政部子部门
        code:'', //编码 XZBZBM
        managerId:'',//部门负责人ID
        introduce:'部门介绍',
        pid:'',//父级部门id
        id:'',//自己的id
      }
      
     
    };
  },
  computed: {},
  created() {
    //获取tree组织结构树
    this.$getData('/company/department').then(r=>{
      this.treeData=Object.freeze( buildTreeOptimized(r))
    })
    //获取部门负责人下拉框列表
    this.$getData('/sys/user/simple').then(r=>{
      this.fzrOptions=Object.freeze(r)
  })
  },
  methods: {
    handleNodeClick(type,data) {
      if(type==='add'){
        this.title='新增部门'
        this.form.pid=data.id
        this.dialogVisible=true
        return
      }
      if(type==='edit'){
        this.title='编辑部门'
        this.form.pid=data.pid
        this.form.id=data.id
        this.form.name=data.name
        this.form.code=data.code
        this.form.managerId=data.managerId
        this.dialogVisible=true
        return
      }
      if(type==='del'){
        this.$postData(`/company/department/${data.id}`,{method:'delete'}).then(()=>{
          this.$getData('/company/department').then(r=>{
            this.treeData=Object.freeze( buildTreeOptimized(r))
          })
        })
        return
      }
    },
    onSubmit(){
      if(this.title==='新增部门'){
        const {id,...rest}=this.form
        this.$postData('/company/department',{data:rest})
        .then(()=>{
          this.closed()
          this.$getData('/company/department').then(r=>{
            this.treeData=Object.freeze( buildTreeOptimized(r))
          })
        })
        return
      }
      
      if(this.title==='编辑部门'){
        this.$postData(`/company/department/${this.form.id}`,{method:'put',data:this.form})
        .then(()=>{
          this.closed()
          this.$getData('/company/department').then(r=>{
            this.treeData=Object.freeze( buildTreeOptimized(r))
          })
        })
        return
      }
        
    },
    cancel(){
      this.$refs.formRef.resetFields()
      this.form={
        name:'',
        code:'',
        managerId:'',
        introduce:'部门介绍',
        pid:'',
        id:''
      }
      this.dialogVisible=false
    },
    closed(){
      this.cancel()
    }
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>