/**
 * 为表单组件提供的 工具方法
 */

// 更新表字段options
export function updateFormFieldOptions(formProps, name, options) {
  const contents = formProps.contents.filter(content => content.name === name)
  if (contents.length > 0) {
    const content = contents[0]
    content.options = options
  }
}

// 更新表字段状态（是否显示，是否禁用）
export function updateFormFieldStatus(formProps, fields) {
  fields.forEach(field => {
    var contents = formProps.contents.filter(content => content.name === field.name)
    if (contents.length > 0) {
      const content = contents[0]
      content.show = field.show !== false
      content.props = content.props || {}
      content.props.disabled = field.disabled
    }
  })
}
