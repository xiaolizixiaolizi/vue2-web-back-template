<template>
  <div style="margin-left: 20px;margin-top:20px">
    <el-button type="primary" @click="handleClick('添加')">添加角色</el-button>
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column prop="name" label="角色">
        <template slot-scope="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.name }}</span>
          <el-input v-else v-model="scope.row.name" :class="{hasError:scope.row.nameHasErrorClass}"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="stateCn" label="启用">
        <template slot-scope="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.stateCn }}</span>
          <el-switch v-else v-model="scope.row.state" :active-value="1" :inactive-value="0" @change="switchChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template slot-scope="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.description }}</span>
          <el-input v-else v-model="scope.row.description" :class="{hasError:scope.row.descriptionHasErrorClass}"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <div v-if="!scope.row.isEdit">
            <el-button @click="handleClick('分配权限',scope.row)" type="text" size="small">分配权限</el-button>
            <el-button @click="handleClick('编辑',scope.row)"  type="text" size="small">编辑</el-button>
            <el-button @click="handleClick('删除',scope.row)"  type="text" size="small">删除</el-button>
          </div>
          <div v-else>
            <el-button @click="handleClick('编辑确认',scope.row)" type="text" size="small">确定</el-button>
            <el-button @click="handleClick('编辑取消',scope.row)" type="text" size="small">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="closed"
      >
     <el-form  ref="formRef" :model="form" label-width="120px">
      <el-form-item label="角色名称"><el-input v-model="form.name"></el-input></el-form-item>
      <el-form-item label="启用"><el-switch v-model="form.state" :active-value="1" :inactive-value="0"></el-switch></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: "role",
  data() {
    return {
      tableData: [],
      title:'',
      dialogVisible:false,
      form:{
        name:'',
        state:1, //1启用 0未启用
        description:'角色介绍',
        id:''
      }
    };
  },
  computed: {},
  created() {
    this.getTableData()
    
  },
  methods: {
    getTableData(){
      this.$getData('/sys/role',{params:{page:1,pagesize:30}}).then(r=>{
        const map={0:'未启用',1:'已启用'}
        r.rows.forEach(item=>{
          item.isEdit=false
          item.nameHasErrorClass=false
          item.descriptionHasErrorClass=false
          item.stateCn=map[item.state]||'未知'
          item.copyRow=JSON.parse(JSON.stringify(item))
        })
        this.tableData=r.rows
        console.log('this.tableData',this.tableData)
      })
    },
    switchChange(row){
      const map={0:'未启用',1:'已启用'}
      row.stateCn=map[row.state]||'未知'
    },
    handleClick(type,row){
       if(type==='添加'){
        this.title='添加角色'
        this.dialogVisible=true
        return
      }
    
      if(type==='编辑'){
        this.title=''
        row.isEdit=true
        return
      }
      if(type==='编辑确认'){
        this.title=''
        if(!row.name) row.nameHasErrorClass=true,this.$message.warning('数据不合法');
        else  row.nameHasErrorClass=false
        if(!row.description) row.descriptionHasErrorClass=true,this.$message.warning('数据不合法');
        else row.descriptionHasErrorClass=false

        if(!row.name||!row.description)return //检验数据不通过
        row.isEdit=false
        const data={
          id:row.id,
          name:row.name,
          description:row.description,
          state:row.state
        }
        this.$postData(`/sys/role/${row.id}`,{method:'put',data}).then(()=>{
          this.getTableData()
        })
        
        return 
      }
      if(type==='编辑取消'){
        this.title=''
        row.name=row.copyRow.name
        row.description=row.copyRow.description
        row.state=row.copyRow.state
        row.stateCn=row.copyRow.stateCn
        row.isEdit=false
        return 
      }
      if(type==='删除'){
        this.title=''
        this.$postData(`/sys/role/${row.id}`,{method:'delete'}).then(()=>{
          this.getTableData()
        })
        return
      }
      if(type==='分配权限'){
        this.title=''
        return
      }
    },
    onSubmit(){
      if(this.title==='添加角色'){
        const {id,...rest}=this.form
        this.$postData('/sys/role',{data:rest})
        .then(()=>{
          this.closed()
          this.getTableData()
        })
        return
      }
      
    
        
    },
    cancel(){
      this.$refs.formRef.resetFields()
      this.form={
        name:'',
        state:1,
        description:'角色介绍',
        id:''
      }
      this.title=''
      this.dialogVisible=false
    },
    closed(){
      this.cancel()
    }
  },
  watch: {},
};
</script>
<style lang="scss">
.el-input.hasError{
  border:1px solid #F56C6C;
}
</style>
<style lang="scss" scoped>
</style>