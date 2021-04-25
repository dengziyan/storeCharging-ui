import { getAffixs } from '@/api/system/affix'
import { downloadFile } from '@/api/common'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      affixs: []
    }
  },
  watch: {
    id: function() {
      this.getAffixs()
    }
  },
  methods: {
    getAffixs() {
      getAffixs({ businessId: this.id }).then(res => {
        this.affixs = res.rows.map((element) => {
          return { affixId: element.affixId, fileName: element.fileName }
        })
      })
    },
    clickDownload(row) {
      downloadFile(`/system/sysAffix/download/${row.affixId}/${row.fileName}`, 'get')
    }
  }
}
