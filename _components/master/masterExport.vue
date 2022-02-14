<template>
  <master-modal v-model="showModal" icon="fas fa-file-download" width="380px" :loading="loading"
                :title="modalTitle" @hide="reset()" @show="init()">
    <div class="relative-position" style="max-width: 350px">
      <div class="row q-col-gutter-md">
        <!--Generate new report-->
        <div id="newReportContent" class="col-12" v-if="!customExportData">
          <div class="box box-auto-height">
            <!--Title-->
            <div class="text-blue-grey q-mb-sm">
              <b>{{ $tr('isite.cms.messages.newReport') }}</b>
            </div>
            <!--Text help Item-->
            <div class="text-caption q-mb-xs" v-if="exportItem && paramsItem.item"
                 v-html="$tr('isite.cms.messages.newExportItemHelpText', {id: paramsItem.item.id})"></div>
            <!--Text help-->
            <div class="text-caption q-mb-xs" v-else
                 v-html="$tr('isite.cms.messages.newExportHelpText', {pageTitle: $tr($route.meta.title)})"></div>
            <!--Actions-->
            <div class="text-right q-mt-md">
              <!--Extra filter fields-->
              <q-form autocorrect="off" autocomplete="off" ref="formContent"
                      class="row full-width"
                      @submit="newReport()" @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
                <!--Fields-->
                <dynamic-field v-for="(field, keyField) in (params.exportFields || [])" :key="keyField"
                               :field="field" class="col-12" v-model="filters[keyField]"/>
                <!--Submit-->
                <div class="text-right col-12">
                  <q-btn :label="$tr('isite.cms.label.create')" color="green" rounded unelevated size="11px"
                         padding="xs sm" type="submit"/>
                </div>
              </q-form>
            </div>
          </div>
        </div>
        <!--Last Report information-->
        <div id="lastReportContent" v-if="fileExport && fileExport.path" class="q-mb-md col-12">
          <div class="box box-auto-height">
            <!--Title-->
            <div class="text-blue-grey q-mb-sm">
              <b>{{ $tr('isite.cms.messages.lastReport') }}</b>
            </div>
            <!--Date-->
            <div class="text-caption">
              <label class="text-blue-grey">{{ $tr('isite.cms.label.date') }}:</label>
              {{ $trd(fileExport.lastModified, {type: 'long'}) }}
            </div>
            <!--Size-->
            <div class="text-caption">
              <label class="text-blue-grey">{{ $tr('isite.cms.label.size') }}:</label>
              {{ $helper.formatBytes(fileExport.size) }}
            </div>
            <!--Action-->
            <div class="text-right q-mt-md">
              <q-btn :label="$tr('isite.cms.label.download')" color="green" rounded unelevated size="11px" padding="xs sm"
                     @click="$helper.downloadFromURL(fileExport.path)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </master-modal>
</template>
<script>
export default {
  beforeDestroy() {
    this.$root.$off('export.data.refresh')
    this.$eventBus.$off('isite.export.ready')
  },
  props: {
    exportItem: {type: Boolean, default: false}
  },
  components: {},
  watch: {
    '$route.name': {
      deep: true,
      handler: function (newValue) {
        this.init()
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      params: false,
      paramsItem: {},
      customExportData: false,
      showModal: false,
      fileExport: false,
      filters: {}
    }
  },
  computed: {
    //Return params of subHeader
    routeParams() {
      let response = false
      //GEt route permission
      let permission = this.$route.meta.permission

      //Parse Route Permission
      if (permission) {
        let splitPermission = this.$route.meta.permission.split('.')
        response = {
          moduleName: (splitPermission[0] == 'profile') ? 'iprofile' : splitPermission[0],
          entityName: splitPermission[1]
        }
      }

      //Response
      return response
    },
    //Modal export title
    modalTitle() {
      //Default response
      let response = `${this.$tr('isite.cms.label.export')} | `
      //Extra titel
      if (this.exportItem)
        response += `${this.$tr('isite.cms.label.record')} ID: ${this.paramsItem.item ? this.paramsItem.item.id : ''}`
      else
        response += `${this.$tr(this.$route.meta.title)}`
      //Response
      return response
    }
  },
  methods: {
    init() {
      //Get data
      this.getData()
      //Listen event to push new messages
      this.$eventBus.$on('isite.export.ready', (response) => {
        this.$alert.info({
          message: this.$tr('isite.cms.messages.exportReady', {fileName: response.data.fileName}),
          timeOut: 12000,
          actions: [
            {
              label: this.$tr('isite.cms.label.showMore'),
              icon: 'fas fa-file-download',
              color: 'white',
              handler: () => {
                this.showReport(response.data)
              }
            }
          ]
        })
      })
      //Listen refresh report
      this.$root.$on('export.data.refresh', () => this.getData(true))
    },
    //Get data
    async getData() {
      this.loading = true
      await this.getExportConfig()//get export config
      await this.getExportData()//Get export data
      this.loading = false
    },
    //Get export config
    getExportConfig() {
      return new Promise((resolve, reject) => {
        this.params = false//Reset params
        if (!this.routeParams) return resolve(false)

        //Request Params
        let requestParams = {
          refresh: true,
          params: {
            filter: {
              configName: `${this.routeParams.moduleName}.config.exportable.${this.routeParams.entityName}${this.exportItem ? 'Item' : ''}`
            }
          }
        }

        //Request
        this.$crud.index('apiRoutes.qsite.configs', requestParams).then(response => {
          this.params = this.$clone(response.data)
          this.$emit('input', this.$clone(response.data))
          resolve(response.data)
        }).catch(error => {
          resolve(false)
        })
      })
    },
    //Get data
    getExportData() {
      return new Promise((resolve, reject) => {
        if (!this.params) return resolve(false)
        this.loading = true

        //Request params
        let requestParams = {
          refresh: true,
          params: {
            exportParams: this.exportItem ? {...this.params, ...(this.paramsItem.exportParams || {})} : this.params,
            filter: this.exportItem ? (this.paramsItem.filter || {}) : (this.$filter ? this.$filter.values : {})
          }
        }

        //Request
        this.$crud.index('apiRoutes.qsite.export', requestParams).then(response => {
          this.fileExport = response.data
          resolve(response.data)
        }).catch(error => {
          resolve(error)
        })
      })
    },
    //Request new report
    newReport() {
      return new Promise((resolve, reject) => {
        this.loading = true

        //Request params
        let requestParams = {
          exportParams: this.exportItem ? {...this.params, ...(this.paramsItem.exportParams || {})} : this.params,
          filter: {
            ...(this.exportItem ? (this.paramsItem.filter || {}) : (this.$filter ? this.$filter.values : {})),
            ...this.filters
          }
        }

        //Request
        this.$crud.post('apiRoutes.qsite.export', requestParams).then(response => {
          this.$alert.info(this.$tr('isite.cms.messages.reportInProgress', {fileName: this.params.fileName}))
          this.showModal = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Show report
    showReport(customExportData) {
      this.customExportData = this.$clone(customExportData)
      this.showModal = true
    },
    //Show report Item
    showReportItem(params) {
      this.paramsItem = params
      this.showModal = true
    },
    //Reset
    reset() {
      this.loading = false
      this.customExportData = false
      this.fileExport = false
      this.filters = {}
    }
  }
}
</script>
<style lang="stylus">
</style>
