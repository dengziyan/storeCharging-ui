<template>
  <el-form ref="form" class="cmb-form" :model="form" :rules="rules">
    <el-row :gutter="20">
      <el-col :span="operationType === 'query' ? 20 : 24">
        <el-row :gutter="20">
          <template v-for="(content, index) in formProps.contents">
            <el-col v-if="content.show !== false" :key="index" :span="content.span || formProps.span || 8">
              <template v-if="content.render">
                <slot :name="content.render" />
              </template>
              <el-form-item
                v-else
                :class="{'query-form ': operationType === 'query'}"
                :prop="content.name"
                size="small"
                :label="content.label + ':'"
                :label-width="(content.labelWidth || formProps.labelWidth || 100) + 'px'"
              >
                <!-- input -->
                <template v-if="content.type === 'input'">
                  <el-input
                    v-model="form[content.name]"
                    v-bind="content.props"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请输入' + content.label)"
                    v-on="content.listeners"
                    @input="search"
                  />
                </template>
                <!-- select -->
                <template v-else-if="content.type === 'select'">
                  <el-select
                    v-model="form[content.name]"
                    class="cmb-select"
                    v-bind="content.props"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请选择' + content.label)"
                    v-on="content.listeners"
                    @change="search"
                  >
                    <el-option v-for="(option, idx) in content.options" :key="idx" :label="option.label" :value="option.value" />
                  </el-select>
                </template>
                <!-- radio -->
                <template v-else-if="content.type === 'radio'">
                  <el-radio-group
                    v-model="form[content.name]"
                    v-bind="content.props"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    v-on="content.listeners"
                    @change="search"
                  >
                    <el-radio v-for="(option, idx) in content.options" :key="idx" :label="option.value">{{ option.label }}</el-radio>
                  </el-radio-group>
                </template>
                <!-- treeSelect -->
                <template v-else-if="content.type === 'treeSelect'">
                  <el-select
                    v-model="form[content.name]"
                    class="cmb-select"
                    v-bind="content.props"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请选择' + content.label)"
                    v-on="content.listeners"
                    @change="search"
                  >
                    <cmb-tree-option
                      :options="content.options"
                      v-bind="(content.tree || {}).props"
                      :show-checkbox="content.props && content.props.multiple"
                      check-strictly
                      highlight-current
                      check-on-click-node
                      v-on="(content.tree || {}).listeners"
                    />
                  </el-select>
                </template>
                <!-- inputnumber -->
                <template v-else-if="content.type === 'inputNumber'">
                  <el-input-number
                    v-model="form[content.name]"
                    v-bind="content.props"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请输入' + content.label)"
                    v-on="content.listeners"
                    @change="search"
                  />
                </template>
                <!-- datePicker -->
                <template v-else-if="content.type === 'datePicker'">
                  <el-date-picker
                    v-model="form[content.name]"
                    v-bind="content.props"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请选择' + content.label)"
                    v-on="content.listeners"
                    @change="search"
                  />
                </template>
                <!-- timePicker -->
                <template v-else-if="content.type === 'timePicker'">
                  <el-time-picker
                    v-model="form[content.name]"
                    v-bind="content.props"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请选择' + content.label)"
                    v-on="content.listeners"
                    @change="search"
                  />
                </template>

                <!-- timeSelect -->
                <template v-else-if="content.type === 'timeSelect'">
                  <el-time-select
                    v-model="form[content.name]"
                    v-bind="content.props"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请选择' + content.label)"
                    v-on="content.listeners"
                    @change="search"
                  />
                </template>
                <!-- cascader -->
                <template v-else-if="content.type === 'cascader'">
                  <el-cascader
                    v-model="form[content.name]"
                    v-bind="content.props"
                    :options="content.options"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请选择' + content.label)"
                    v-on="content.listeners"
                    @change="search"
                  />
                </template>
                <!-- colorPicker -->
                <template v-else-if="content.type === 'colorPicker'">
                  <el-color-picker
                    v-model="form[content.name]"
                    v-bind="content.props"
                    :disabled="(content.props && content.props.disabled) || operationType === 'view'"
                    :placeholder="(content.props && content.props.placeholder) || ('请选择' + content.label)"
                    v-on="content.listeners"
                    @change="search"
                  />
                </template>
                <!-- slot -->
                <template v-else-if="content.type === 'slot'">
                  <slot :name="content.name" />
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-col>

      <el-col v-if="footerButton" :span="operationType === 'query' ? 4 : 24">
        <template v-if="operationType === 'query'">
          <el-button type="primary" size="small" @click="reset">重置</el-button>
          <el-button type="primary" size="small" @click="search">搜索</el-button>
        </template>
        <div v-if="operationType === 'edit' || operationType === 'add'" :class="{'edit-button': operationType === 'edit' || operationType === 'add'}">
          <el-button type="primary" size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="submit">提交</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import cmbTreeOption from '@/components/CMBTreeOption'
export default {
  name: 'CmbForm',
  components: { cmbTreeOption },
  props: {
    formProps: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    operationType: {
      type: String,
      default: () => {
        return 'query'
      },
      validator: val => ['query', 'add', 'edit', 'view'].indexOf(val) > -1
    },
    footerButton: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      rules: {}
    }
  },
  watch: {
    formProps: function(newVal, oldVal) {
      // 重置默认值
      const keys = Object.keys(this.form)
      oldVal.contents.forEach(content => {
        if (content.name && keys.indexOf(content.name) < 0) {
          this.$delete(this.form, content.name)
        }
      })
      this.resetInitValue()
      // 重置规则
      // Object.keys(this.rules).forEach(key => {
      //   this.$delete(this.rules, key)
      // })
      // this.addDefaultRule()
    }
  },
  created() {
    this.resetInitValue()
    this.addDefaultRule()
  },
  mounted() {

  },
  methods: {
    addDefaultRule() {
      this.formProps.contents.forEach(content => {
        if (content.required) {
        // 添加是否必填
          const rule = content.type === 'input' || content.type === 'tinymce'
            ? { required: true, message: '请输入' + content.label, trigger: 'blur' }
            : { required: true, message: '请选择' + content.label, trigger: 'change' }
          if (content.rule && content.rule instanceof Array) {
          // 替换validator里面的this
            content.rule.forEach(item => {
              if (item.validator && typeof item.validator === 'function') {
                item.validator = item.validator.bind(this)
              }
            })
            this.$set(this.rules, content.name, [...content.rule, rule])
            // this.rules[content.name] = [...content.rule, rule]
          } else {
            this.$set(this.rules, content.name, [rule])
            // this.rules[content.name] = [rule]
          }
        }
      })
    },
    resetInitValue() {
      this.formProps.contents.forEach(content => {
        if (content.name) {
          this.$set(this.form, content.name, this.operationType === 'query' ? content.initValue : this.form[content.name])
        }
      })
    },
    reset() {
      this.resetInitValue()
      this.$emit('on-change', this.form)
    },
    search() {
      this.$emit('on-change', this.form)
    },
    cancel() {
      this.$emit('on-cancel', this.form)
    },
    validForm() {
      let result
      this.$refs.form.validate((valid) => {
        result = valid
        return valid
      })
      return result
    },
    submit() {
      if (this.validForm()) {
        this.$emit('on-submit', this.form)
      } else {
        console.log('error submit!!')
      }
    },
    invokeFormMethod(methodName, params) {
      this.$refs.form[methodName](params)
    }
  }
}
</script>

<style lang="scss">
.cmb-form{
  .query-form.el-form-item--mini.el-form-item
  ,.query-form.el-form-item--small.el-form-item{
    margin-bottom: 5px;
  }
  .query-form.el-form-item{
    margin-bottom: 5px;
  }
}
</style>

<style lang="scss" scoped>
.cmb-form{
  background-color: rgba(1,1,1,0);
  padding: 0px;
  .edit-button{
    float: right;
  }
  .cmb-select{
    width: 100%;
  }
}
</style>
