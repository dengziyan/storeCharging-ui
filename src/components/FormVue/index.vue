<template>
  <!--form表单再组件化，主要用于弹框-->

  <el-form
    ref="ruleForm"
    class="demo-ruleForm"
    :label-width="formData.labelWidth"
    :model="dataForm"
    :inline="formData.inline"
    :rules="formData.rules"
    :size="formData.size"
    :label-position="formData.labelPosition"
  >
    <el-form-item
      v-for="(item, index) in formData.formItem"
      :key="index"
      :label="item.label"
      :prop="item.prop"
    >
      <!-- 文本框 -->
      <el-input
        v-if="item.type === 'text'"
        v-model="dataForm[item.prop]"
        :disabled="item.isDisabled"
        :required="item.required"
        :size="item.size"
      />
      <!-- 密码框 -->
      <el-input
        v-if="item.type === 'password'"
        v-model="dataForm[item.prop]"
        type="password"
        :disabled="item.isDisabled"
      />
      <!-- 单选框 -->
      <el-radio-group
        v-if="item.type === 'radio'"
        v-model="dataForm[item.prop]"
      >
        <el-radio
          v-for="item in item.options"
          :key="item.value"
          :label="item.value"
        >
          {{ item.name }}
        </el-radio>
      </el-radio-group>
      <!-- 单选按钮 -->
      <el-radio-group
        v-if="item.type === 'radioButton'"
        v-model="dataForm[item.prop]"
        :disabled="item.isDisabled"
      >
        <el-radio-button
          v-for="item in item.options"
          :key="item.value"
          :label="item.value"
        >
          {{ item.name }}
        </el-radio-button>
      </el-radio-group>
      <!-- 多选框组 -->
      <el-checkbox-group
        v-if="item.type === 'checkbox'"
        v-model="dataForm[item.prop]"
      >
        <el-checkbox
          v-for="item in item.options"
          :key="item.value"
          :disabled="item.isDisabled"
          :label="item.value"
        >
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <!-- 下拉框 -->
      <el-select
        ref="selectForm"
        v-if="item.type === 'select'"
        v-model="dataForm[item.prop]"
        :multiple="item.multiple"
        :value="item.tip"
        collapse-tags
        clearable
        :disabled="item.isDisabled"
        :placeholder="item.placeholder"
      >
        <el-option
          v-for="val in item.options"
          :key="val.value"
          :label="val.label"
          :value="val.value"
          :disabled="val.isDisabled"
        />
      </el-select>
      <!-- 联级面板 -->
      <el-cascader
        v-if="item.type === 'cascader'"
        v-model="dataForm[item.prop]"
        :options="item.options"
        :disabled="item.isDisabled"
        filterable
        clearable
      />
      <!-- 开关 -->
      <el-switch v-if="item.type === 'switch'" v-model="dataForm[item.prop]" />
      <!-- 日期选择器 -->
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="dataForm[item.prop]"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期"
      />
      <!-- 时间选择器 -->
      <el-time-picker
        v-if="item.type === 'time'"
        v-model="dataForm[item.prop]"
        placeholder="请选择时间"
      />
      <!-- 日期时间选择器 -->
      <el-date-picker
        v-if="item.type === 'dateTime'"
        v-model="dataForm[item.prop]"
        type="datetime"
        placeholder="选择日期时间"
      />
      <!-- 日期范围选择器     -->
      <el-date-picker
        v-if="item.type === 'daterange'"
        v-model="dataForm[item.prop]"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <!-- 日期和时间范围选择器  -->
      <el-date-picker
        v-if="item.type === 'datetimerange'"
        v-model="dataForm[item.prop]"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <!--上传模板    -->
      <div v-if="item.type === 'upload'">
        <el-button @click="item.importTemplate()">下载模板</el-button>
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="item.upload.headers"
          :action="item.upload.url"
          :http-request="item.handleFileUpload"
          :auto-upload="false"
        >
          <el-button size="small">上传Excel</el-button>
        </el-upload>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    formData: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataForm: this.form,
      value1: '',
      fileList: [],
      // 用户导入参数
      upload: {
        open: false, // 是否显示弹出层（用户导入）
        title: '', // 弹出层标题（用户导入）
        isUploading: false, // 是否禁用上传
        updateSupport: 0, // 是否更新已经存在的用户数据
        headers: { Authorization: getToken() }, // 设置上传的请求头部
        url: process.env.VUE_APP_BASE_API + '/sys/user/import' // 上传的地址
      }
    }
  },
  watch: {
    formWatch: function (val) {
      this.dataForm = val
    }
  },

  created() {
    // console.log('qwwwww')
    this.bindValue()
  },
  methods: {
    bindValue() {
      const obj = {}
      this.formData.formItem.forEach((item, index) => {
        // 这里不能写成this.form = obj  因为传递的不是值，而是引用，他们指向了同一个空间！
        obj[item.prop] = item.value
      })
    }
  }
}
</script>

<style scoped>
.el-input--small {
  width: 180px;
}
.el-button {
  margin-right: 20px;
}
.el-form-item__content .upload-demo {
  float: left;
}
.el-form-item__content .button {
  float: left;
}
.el-form-item--small {
  float: left;
}
.dialog-footer button {
  float: left;
}
.demo-ruleForm {
  height: 300px;
}
</style>
