<template>
  <div>
    <el-table
      ref="dataTable"
      :data="dataSource.list || []"
      :height="tableHeight"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      :stripe="options.stripe"
      :border="options.border"
    >
      <!-- selection选择框 -->
      <el-table-column
        v-if="options?.selectType === 'checkbox'"
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <!-- 序号 -->
      <el-table-column
        v-if="options.showIndex"
        type="index"
        width="60"
        label="序号"
        align="center"
      ></el-table-column>
      <!-- 数据列 -->
      <template v-for="(column, index) in columns">
        <template v-if="column.scopedSlots">
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
          >
            <template #default="scope">
              <slot
                :name="column.scopedSlots"
                :index="scope.$index"
                :row="scope.row"
              ></slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
            :fixed="column.fixed"
          >
          </el-table-column>
        </template>
      </template>
      <!-- 分页 -->
    </el-table>
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-if="dataSource.totalCount"
        background
        :total="dataSource.totalCount"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="dataSource.pageSize"
        :current-page.sync="dataSource.pageNo"
        layout="total,sizes,prev,pager,next,jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNoChange"
        style="text-align: right"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const dataTable = ref(null);

const props = defineProps({
  dataSource: {
    type: Object,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  // 表格属性
  options: {
    type: Object,
    default: {
      tableHeight: null,
      stripe: true,
      border: false,
      extHeight: 0,
      showIndex: false,
    },
  },
  // 数据列
  columns: {
    type: Array,
  },
  // 获取数据的函数
  fetch: Function,
  initFetch: {
    type: Boolean,
    default: true,
  },
});
// 顶部200 内容区域距离顶部20 内容上下内间距15*2 分页区域高度46
const topHeight = 200 + 20 + 30 + 46;
const tableHeight = ref(
  props.options.tableHeight ||
    window.innerHeight - topHeight - props.options.extHeight ||
    0
);
// 初始化
const init = () => {
  if (props.initFetch && props.fetch) {
    props.fetch();
  }
};
init();

// 清除选中
const clearSelection = () => {
  dataTable.value.clearSelection();
};
// 设置行选中
const setCurrentRow = (rowKey, rowVale) => {
  const row = props.dataSource.list.find((item) => item[rowKey] === rowVale);
  dataTable.value.setCurrentRow(row);
};

defineExpose({ setCurrentRow, clearSelection });
const emit = defineEmits(["rowSelected", "rowClick"]);

const handleRowClick = (row) => {
  emit("rowClick", row);
};
// 行选中
const handleSelectionChange = (rows) => {
  emit("rowSelected", rows);
};
// 切换每页的大小
const handlePageSizeChange = (size) => {
  props.dataSource.pageSize = size;
  props.dataSource.pageNo = 1;
  props.fetch();
};
// 切换页码
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  props.fetch();
};
</script>

<style lang="scss">
.pagination {
  padding-top: 10px;
}
.el-pagination {
  justify-content: right;
}
.el-table__body tr.current-rwo > td.el-table__cell {
  background: #e6f0f9;
}
.el-table__body tr:hover > td.el-table__cell {
  background: #e6f0f9 !important;
}
</style>
