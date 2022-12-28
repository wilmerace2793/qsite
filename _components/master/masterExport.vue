<template>
  <master-modal v-model="showModal" icon="fas fa-file-download" width="380px" :loading="loading"
                :title="modalTitle" @hide="reset()" @show="init()" custom-position>
    <div class="relative-position">
      <div class="row q-col-gutter-md">
        <!--Generate new report-->
        <div id="newReportContent" class="col-12" v-if="!customExportData && allowCreation">
          <!--Title-->
          <div class="text-blue-grey q-mb-sm">
            <b>{{ $tr('isite.cms.messages.newReport') }}</b>
          </div>
          <!--Text help Item-->
          <div class="text-caption q-mb-xs" v-if="exportItem && paramsItem.item"
               v-html="$tr('isite.cms.messages.newExportItemHelpText', {id: paramsItem.item.id})"></div>
          <!--Text help-->
          <div class="text-caption q-mb-xs" v-else
               v-html="$tr('isite.cms.messages.newExportHelpText', {pageTitle: pageTitle})"></div>
          <!--Actions-->
          <div class="text-right q-mt-md">
            <!--Extra filter fields-->
            <q-form autocorrect="off" autocomplete="off" ref="formContent" class="row full-width"
                    @submit="newReport()" @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
              <!--Fields-->
              <dynamic-field v-for="(field, keyField) in filterFields" :key="keyField"
                             :field="field" class="col-12" v-model="filters[keyField]"/>
              <!--Submit-->
              <div class="text-right col-12">
                <q-btn :label="$tr('isite.cms.label.create')" color="green" rounded unelevated size="13px"
                       padding="xs sm" type="submit"/>
              </div>
            </q-form>
          </div>
        </div>
        <!--Last Report information-->
        <div id="lastReportContent" v-if="fileExport.length" class="q-mb-md col-12">
          <div v-for="(file, keyFile) in fileExport" :key="keyFile">
            <q-separator class="q-my-md"/>
            <!--Title-->
            <div class="text-blue-grey q-mb-sm">
              <b>{{ $tr('isite.cms.messages.lastReport') }}{{ file.fileFormat ? ` (${file.fileFormat})` : '' }}</b>
            </div>
            <!--Date-->
            <div class="text-caption">
              <label class="text-blue-grey">{{ $tr('isite.cms.label.date') }}:</label>
              {{ $trd(file.lastModified, {type: 'long'}) }}
            </div>
            <!--Size-->
            <div class="text-caption">
              <label class="text-blue-grey">{{ $tr('isite.cms.label.size') }}:</label>
              {{ $helper.formatBytes(file.size) }}
            </div>
            <!--Action-->
            <div class="text-right q-mt-md">
              <q-btn :label="$tr('isite.cms.label.download')" color="green" rounded unelevated size="13px"
                     padding="xs sm" @click="$helper.downloadFromURL(file.path)"/>
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
      fileExport: [],
      filters: {}
    }
  },
  computed: {
    //Page title
    pageTitle() {
      const useLegacyStructure = parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('isite::legacyStructureCMS') || 0)
      return useLegacyStructure ? this.$tr(this.$route.meta.title) : this.$route.meta.title
    },
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
        response += this.pageTitle
      //Response
      return response
    },
    //filter fields
    filterFields() {
      //Instance default filter fields
      var fields = (this.params.exportFields || {})

      //Add format fields
      if (this.params.formats && Array.isArray(this.params.formats)) {
        fields.fileFormat = {
          value: this.params.formats[0],
          type: 'select',
          props: {
            label: this.$tr('isite.cms.label.format'),
            readonly: this.params.formats.length >= 2 ? false : true,
            options: this.params.formats.map(format => {
              return {label: format, value: format}
            })
          }
        }
      }

      //Response
      return fields
    },
    //Allow Downloads from custom config
    allowCreation(){
      return this.params.allowCreation !== undefined ? this.params.allowCreation : true
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
      return new Promise(async (resolve, reject) => {
        if (!this.params) return resolve(false)
        this.loading = true
        const filter = await this.storeFilter();
        //Request params
        let requestParams = {
          refresh: true,
          params: {
            exportParams: this.exportItem ? {...this.params, ...(this.paramsItem.exportParams || {})} : this.params,
            filter: this.exportItem ? (this.paramsItem.filter || {}) : (filter ? filter.values : {})
          }
        }

        //Request
        this.$crud.index('apiRoutes.qsite.export', requestParams).then(response => {
          this.fileExport = Array.isArray(response.data) ? response.data : [response.data]
          resolve(response.data)
        }).catch(error => {
          resolve(error)
        })
      })
    },
    //Request new report
    newReport() {
      return new Promise(async (resolve, reject) => {
        //this.loading = true
        //Instance de apiRoute
        const apiRoute = this.params.apiRoute || 'apiRoutes.qsite.export'
        const filter = await this.storeFilter();
        //Request params
        let requestParams = {
          exportParams: {
            ...(this.exportItem ? {...this.params, ...(this.paramsItem.exportParams || {})} : this.params),
            fileFormat: this.filters.fileFormat
          },
          filter: {
            ...(this.exportItem ? (this.paramsItem.filter || {}) : (filter ? filter.values : {})),
            ...this.filters
          }
        }

        //Request
        this.$crud.post(apiRoute, requestParams).then(response => {
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
      this.fileExport = []
      this.filters = {}
    },
    async getCurrentFilterDate(lastStart, lastEnd) {
      try {
        let lastStartM = this.$moment(lastStart)
          .startOf('day')
          .format("YYYY-MM-DD HH:mm:ss");
        let lastEndM = this.$moment(lastEnd)
          .endOf('day')
          .format("YYYY-MM-DD HH:mm:ss");
        return {
          date: {
            field: "inbound_scheduled_arrival",
            type: "custom",
            from: lastStartM,
            to: lastEndM,
          },
        };
      } catch (error) {
        console.log(error);
      }
    },
    async storeFilter() {
      const filterClone = this.$filter.storeFilter ? { values: await this.convertStringToObject() } : this.$clone(this.$filter);
      let filter = { ...filterClone };
        if(this.$filter.storeFilter) {
          if(filter.values.dateStart && filter.values.dateEnd) {
            const dateFilter = await this.getCurrentFilterDate(filter.values.dateStart, filter.values.dateEnd);
            delete filter.values.type;
            delete filter.values.dateStart;
            delete filter.values.dateEnd;
            filter.values = {
              ...dateFilter,
              ...filter.values,
            }
          }
        }
      return filter;
    },
    async convertStringToObject() {
      try {
        let url = "";
        const origin = window.location.href.split("?");
        if (origin.length === 2) {
          url = origin[1] || "";
        }
        if (url.length > 0) {
          const regex = /=/g;
          const regex2 = /&/g;
          const remplaceFilter = url.replace(regex, ":").replace(regex2, ",");
          const remplaceObject = eval("({" + remplaceFilter + "})");
          Object.keys(remplaceObject).forEach((key) => {
            if (this.$filter.fields.hasOwnProperty(key)) {
              remplaceObject[key] = String(remplaceObject[key]);
            }
          });
          return remplaceObject || {};
        }
        return {};
      } catch (error) {
        this.$alert.error('The filter url is misspelled');
        console.log(error);
      }
    },
  }
}
</script>
<style lang="stylus">
</style>
