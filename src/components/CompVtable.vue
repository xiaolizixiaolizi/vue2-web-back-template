<template>
	<div :class="payloadClass">
		<el-table class="hk-table" :data="tableData" style="width: 100%"  v-bind="$attrs" v-on="$listeners" ref="TableRef" v-loading="loading" element-loading-text="拼命加载中..." element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange" :header-cell-style="{'text-align':'center','font-size': '14px',color: '#171717','font-weight': '400'}">
			<el-table-column v-if="(payload || {}).isSingleChoiceTable" type="selection" width="55" align="center" v-bind="payload.selection" key="Single"> </el-table-column>
			<el-table-column v-if="(payload || {}).isMultiChoiceTable" type="selection" width="55" align="center" v-bind="payload.selection" reserve-selection key="mult"> </el-table-column>
			<el-table-column v-if="(payload || {}).showIndex !== false" type="index" width="50" label="序号" align="center" v-bind="payload.index" :index="indexMethod"></el-table-column>
			<el-table-column v-for="item in tableColumn" :key="item.prop + item.label" v-bind="item">
				
				<template slot-scope="scope">
					<template v-if="item.slotName">
						<slot :name="item.slotName" v-bind="scope">{{ defaultValue(scope.row[item.prop]) }}</slot>
					</template>

					<template v-else-if="item.formatter">{{ item.formatter(scope.row, scope.column, scope.row[item.prop]) }}</template>

					<template v-else>{{ defaultValue(scope.row[item.prop]) }}</template>
				</template>
			</el-table-column>
			<template v-slot:empty>
				<div class="v-empty">
					<img class="el-empty__image" src="./img/empty.svg"><div class="el-empty__description">暂无数据</div>
				</div> 
			</template>
		</el-table>
		<el-pagination
			v-if="(payload || {}).showPagination !== false"
			:class="paginationPosition"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="pagination.currentPage"
			:page-sizes="pagination.pageSizes || defaultPageSizes"
			:page-size="pagination.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="pagination.total"
			background
			data-theme="dark"
			popper-class="dark-popper">
		</el-pagination>
	</div>
</template>

<script>
export default {
	name: 'VTable',
	props: {
		tableColumn: {
			type: Array,
			required: true,
			default: () => [],
		},
		tableData: {
			type: Array,
			required: true,
			default: () => [],
		},
		pagination: {
			type: Object,
			required: false,
			default: () => ({}),
		},
		payload: {
			type: Object,
			required: false,
			default: () => ({}),
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			singleChoiceData: {}, //单选选中的数据
			multiChoiceData: {}, //单选选中的数据
		}
	},
	computed: {
		payloadClass() {
			return {
				'v-table': true,
				'is-single-choice-table': (this.payload || {}).isSingleChoiceTable,
			}
		},
		paginationPosition() {
			return `is-${(this.payload || {}).paginationPosition || 'right'}`
		},
	},
	methods: {
		clearSelection() {
			this.singleChoiceData = {}
			return this.$refs.TableRef.clearSelection()
		},
		toggleRowSelection(row, selected) {
			return this.$refs.TableRef.toggleRowSelection(row, selected)
		},
		toggleAllSelection() {
			return this.$refs.TableRef.toggleAllSelection()
		},
		toggleRowExpansion(row, expanded) {
			return this.$refs.TableRef.toggleRowExpansion(row, expanded)
		},
		setCurrentRow(row) {
			return this.$refs.TableRef.setCurrentRow(row)
		},
		clearSort() {
			return this.$refs.TableRef.clearSort()
		},
		clearFilter(columnKey) {
			return this.$refs.TableRef.clearFilter(columnKey)
		},
		doLayout() {
			return this.$refs.TableRef.doLayout()
		},
		sort(prop, order) {
			return this.$refs.TableRef.sort(prop, order)
		},

		indexMethod(index) {
			return (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
		},
		defaultValue(cellValue) {
			if (cellValue === false || cellValue === 0 || cellValue === '0') return cellValue
			return cellValue || (this.payload || {}).emptyCellValue || '--'
		},

		handleSizeChange(val) {
			if ((this.payload || {}).isSingleChoiceTable)this.clearSelection() //清除选择
			this.pagination.pageSize = val
			this.pagination.currentPage = 1 //页码变了手动回到第一页
			this.$emit('fetchTableData', this.pagination)
		},
		handleCurrentChange(val) {
			if ((this.payload || {}).isSingleChoiceTable)this.clearSelection() //清除选择
			this.pagination.currentPage = val
			this.$emit('fetchTableData', this.pagination)
		},
		handleSelectionChange(val) {
			//单选
			if ((this.payload || {}).isSingleChoiceTable) {
				if (val.length === 0) {
					this.singleChoiceData = {}
				} else if (val.length === 1) this.singleChoiceData = JSON.parse(JSON.stringify(val[0])) //深拷贝防止外界修改表格数据
				else {
					//除了最后一个 其他都取消选择
					val.slice(0, -1).forEach(row => {
						this.toggleRowSelection(row)
					})
					this.singleChoiceData = JSON.parse(JSON.stringify(val[val.length - 1]))
				}
			}
			//多选
			else if((this.payload || {}).isMultiChoiceTable){
				console.log('val-多选',val)
				this.multiChoiceData=val
			}
		},
		getChoiceData() {
			if((this.payload || {}).isSingleChoiceTable) return this.singleChoiceData
			if((this.payload || {}).isMultiChoiceTable) return this.multiChoiceData
			return {}
		},
	},
	mounted() {},
	beforeCreate() {
		this.defaultPageSizes = [5, 10, 20, 50, 100]
	},
	watch: {
		tableData: {
			handler(newVal, oldVal) {
				this.$nextTick(() => this.doLayout())
			},
			immediate: true,
		},
	},
}
</script>

<style lang="scss">

.v-table {
	width: 100%;
	display: grid;
	grid-template-rows: auto auto;
	grid-template-columns: 1fr;
	gap: 20px 0;
}
.v-table{
	.el-table{
		section,div,span,p{
			box-sizing: border-box !important;
		}
	}
}

.v-table .el-pagination {
	justify-self: start;

	&.is-left {
		justify-self: start;
	}

	&.is-center {
		justify-self: center;
	}

	&.is-right {
		justify-self: end;
	}
}
.v-table.is-single-choice-table .el-table__header-wrapper .el-checkbox {
	display: none;
}
</style>
<style lang="scss">
.el-table--border th.gutter:last-of-type {
	display: block !important;
	width: 17px !important;
}
.el-loading-mask {
	background-color: transparent;
}
.v-table .el-table__body-wrapper::-webkit-scrollbar {
	height: 10px !important; //设置水平滚动条高度
	width: 0 !important; //隐藏垂直滚动条
}
.v-table .el-table__body-wrapper::-webkit-scrollbar-thumb {
	background: #c0c4cc  !important;
}
.v-empty{
     display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    box-sizing: border-box;
    padding: 20px 0;
    line-height: 24px;
    .el-empty__image{
      width: 120px;
    }
    .el-empty__description{
      line-height: 24px;
      margin: 0;
      padding: 0;
    }
}
</style>
