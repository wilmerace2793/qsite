<template>
  <master-modal v-model="showModal" icon="fas fa-file-download" width="380px" :loading="loading"
                :title="`${$tr('ui.label.export')} | ${$tr($route.meta.title)}`"
                @hide="reset()" @show="init()">
    <div class="relative-position" style="max-width: 350px">
      <div class="row q-col-gutter-md">
        <!--Generate new report-->
        <div id="newReportContent" class="col-12" v-if="!customExportData">
          <div class="box box-auto-height">
            <!--Title-->
            <div class="text-blue-grey q-mb-sm">
              <b>{{ $tr('qsite.layout.messages.newReport') }}</b>
            </div>
            <!--Text help-->
            <div class="text-caption q-mb-xs"
                 v-html="$tr('qsite.layout.messages.newExportHelpText', {pageTitle: $tr($route.meta.title)})"></div>
            <!--Actions-->
            <div class="text-right q-mt-md">
              <!--Extra filter fields-->
              <q-form autocorrect="off" autocomplete="off" ref="formContent"
                      class="row full-width"
                      @submit="newReport()" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
                <!--Fields-->
                <dynamic-field v-for="(field, keyField) in (params.exportFields || [])" :key="keyField"
                               :field="field" class="col-12" v-model="filters[keyField]"/>
                <!--Submit-->
                <div class="text-right col-12">
                  <q-btn :label="$tr('ui.label.create')" color="green" rounded unelevated size="11px"
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
              <b>{{ $tr('qsite.layout.messages.lastReport') }}</b>
            </div>
            <!--Date-->
            <div class="text-caption">
              <label class="text-blue-grey">{{ $tr('ui.label.date') }}:</label>
              {{ $trd(fileExport.lastModified, {type: 'long'}) }}
            </div>
            <!--Size-->
            <div class="text-caption">
              <label class="text-blue-grey">{{ $tr('ui.label.size') }}:</label>
              {{ $helper.formatBytes(fileExport.size) }}
            </div>
            <!--Action-->
            <div class="text-right q-mt-md">
              <q-btn :label="$tr('ui.label.download')" color="green" rounded unelevated size="11px" padding="xs sm"
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
  props: {},
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
    }
  },
  methods: {
    init() {
      //Get data
      this.getData()
      //Listen event to push new messages
      this.$eventBus.$on('isite.export.ready', (response) => {
        this.$alert.info({
          message: this.$tr('qsite.layout.messages.exportReady', {fileName: response.data.fileName}),
          timeOut: 12000,
          actions: [
            {
              label: this.$tr('ui.label.showMore'),
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
            filter: {configName: `${this.routeParams.moduleName}.config.exportable.${this.routeParams.entityName}`}
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
            exportParams: this.params,
            filter: this.$filter ? this.$filter.values : {}
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
          exportParams: this.params,
          filter: {...(this.$filter ? this.$filter.values : {}), ...this.filters}
        }

        //Request
        this.$crud.post('apiRoutes.qsite.export', requestParams).then(response => {
          this.$alert.info(this.$tr('qsite.layout.messages.reportInProgress', {fileName: this.params.fileName}))
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
