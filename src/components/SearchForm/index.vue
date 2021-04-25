<!-- 搜索表单 -->
<template>
  <div class="ces-search">
    <el-form class="input" :size="size" inline :label-width="labelWidth">
      <el-form-item v-for="item in searchForm" :key="item.prop" :label="item.label">
        <!-- 输入框 -->
        <el-input v-if="item.type==='Input'" v-model="searchData[item.prop]" size="mini"  clearable @clear="clearParams('searchData[item.prop]')" @change="item.change(searchData[item.prop])"/>
        <!-- 下拉框 -->
        <el-select v-if="item.type==='Select'" v-model="searchData[item.prop]" size="mini" filterable clearable @change="item.change(searchData[item.prop])">
          <el-option v-for="(op, index) in item.options" :key="index" :label="op.label" :value="op.value" />
        </el-select>
        <!-- 单选 -->
        <el-radio-group v-if="item.type==='Radio'" v-model="searchData[item.prop]">
          <el-radio v-for="ra in item.radios" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio>
        </el-radio-group>
        <!-- 单选按钮 -->
        <el-radio-group v-if="item.type==='RadioButton'" v-model="searchData[item.prop]" @change="item.change && item.change(searchData[item.prop])">
          <el-radio-button v-for= "ra in item.radios" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio-button>
        </el-radio-group>
        <!-- 复选框 -->
        <el-checkbox-group v-if="item.type==='Checkbox'" v-model="searchData[item.prop]">
          <el-checkbox v-for="ch in item.checkboxs" :key="ch.value" :label="ch.value">{{ ch.label }}</el-checkbox>
        </el-checkbox-group>
        <!--  年份选择器      -->
        <el-date-picker
          v-if="item.type==='year'"
          v-model="searchData[item.prop]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="year"
          placeholder="选择年"
          @change="item.change(searchData[item.prop])">
        </el-date-picker>
        <!-- 日期 -->
        <el-date-picker v-if="item.type==='Date'" v-model="searchData[item.prop]" />
        <!-- 时间 -->
        <el-time-select v-if="item.type==='Time'" v-model="searchData[item.prop]" type="" />
        <!-- 日期时间 -->
        <el-date-picker v-if="item.type==='DateTime'" v-model="searchData[item.prop]" type="datetime" :disabled="item.disable && item.disable(searchData[item.prop])" />
        <!-- 日期和时间范围选择器  -->
        <el-date-picker
          v-if="item.type==='daterange'"
          v-model="searchData[item.prop]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <!--  年月      -->
        <el-date-picker
          v-if="item.type==='monthrange'"
          v-model="searchData[item.prop]"
          type="monthrange"
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份">
        </el-date-picker>
        <!-- 日期和时间范围(最新)       -->
        <el-date-picker
          v-if="item.type==='datetimerange'"
          v-model="searchData[item.prop]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="item.change(searchData[item.prop])"
        >
        </el-date-picker>
        <!-- 滑块 -->
        <!-- <el-slider v-if="item.type==='Slider'" v-model="searchData[item.prop]"></el-slider> -->
        <!-- 开关 -->
        <el-switch v-if="item.type==='Switch'" v-model="searchData[item.prop]" />
      </el-form-item>
    </el-form>
    <el-form v-if="isHandle" inline class="button">
      <el-form-item v-for="item in searchHandle" :key="item.label">
        <el-button :type="item.type" :size="item.size || size" @click="item.handle()">{{ item.label }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    searchForm: {
      // eslint-disable-next-line vue/require-valid-default-prop
      type: Array, default: []
    },
    searchHandle: {
      type: Array, default: () => []
    },
    searchData: {
      // eslint-disable-next-line vue/require-valid-default-prop
      type: Object, default: {}
    },
    isHandle: { type: Boolean, default: true },
    labelWidth: { type: String, default: '100px' },
    size: { type: String, default: 'mini' }
  },
  data() {
    return {
    }
  },
  methods: {
    // 置空参数
    clearParams(val) {
      // eslint-disable-next-line no-return-assign
      // Object.keys(this.searchData).forEach(key => this.searchData[key] = '')
    }
  }
}

</script>
<style scoped>
  .input{
    float: left;
  }
  .button{
    float: left;
  }
  .el-form-item__content {
    line-height: 28px;
  }
</style>
