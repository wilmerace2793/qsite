<template>
  <div id="organizationFormPage">
    <!--Content-->
    <div v-if="organizationIdLocal" id="pageContent">
      <!--page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions :title="pageTitle" @refresh="getData(true)"/>
      </div>
      <!--Form-->
      <div class="relative-position">
        <!--dynamic form-->
        <dynamic-form v-model="form" v-if="!loading && crudData" :blocks="parseCrudData.form.blocks" form-type="grid"
                      @submit="syncOrganization" :item-id="organization.id" :form-col-number="2"/>
        <!--Inner loading-->
        <inner-loading :visible="loading"/>
      </div>
    </div>
    <!--Empty conten-->
    <div v-else class="box box-auto-height text-center">
      <div class="q-py-md">
        <q-icon name="fas fa-crown" size="40px" color="primary" class="q-mb-md"/>
        <div>{{ $tr('isite.cms.messages.noOrganization') }}...</div>
      </div>
    </div>
  </div>
</template>
<script>
import layout from "src/modules/app/_i18n/en-us/layout"
import layoutStore from '@imagina/qsite/_store/layoutStore.js'

export default {
  props: {
    organizationId: {default: null}
  },
  components: {},
  watch: {
    '$route.params.id'(organizationId) {
      this.init()
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
      organization: false,
      crudData: false,
      form: {},
    }
  },
  computed: {
    pageTitle() {
      const useLegacyStructure = parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('isite::legacyStructureCMS') || 0)
      return useLegacyStructure ? this.$tr(this.$route.meta.title) : this.$route.meta.title
    },
    //Organization data
    organizationIdLocal() {
      return this.$clone(this.organizationId || this.$route.params.id)
    },
    //Parse crud data
    parseCrudData() {
      let crudData = this.$clone(this.crudData)
      layoutStore().getLayouts();
      const layoutList = layoutStore().getLayoutsList();
      crudData.form.blocks.push({...layoutList});
      //Parse blocks
      crudData.form.blocks.forEach((block, blockKey) => {
        //Parse block fields
        Object.keys(block.fields).forEach(fieldName => {
          crudData.form.blocks[blockKey].fields[fieldName].fieldItemId = this.organization.id
        })
      })

      //response
      return crudData
    }
  },
  methods: {
    init() {
      this.getData(true)
    },
    //Get data
    getData(refresh = false) {
      return new Promise(async resolve => {
        this.loading = true
        await Promise.all([
          this.getOrganizationData(refresh),
          this.getCrudData(refresh)
        ])
        this.loading = false
      })
    },
    //get organizations data
    getOrganizationData(refresh = false) {
      return new Promise((resolve, reject) => {
        //Validate if user has a organization
        if (!this.organizationIdLocal) return resolve(null)
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'fields,schedule.workTimes',
            filter: {allTranslations: true}
          }
        }
        //Request
        this.$crud.show('apiRoutes.qsite.organizations', this.organizationIdLocal, requestParams).then(response => {
          setTimeout(() => {
            this.organization = this.$clone(response.data)
            this.form = this.$clone(response.data)
            layoutStore().setSelectedLayout(response.data.layoutId);
            resolve(response.data)
          }, 800)
        }).catch(error => reject(error))
      })
    },
    //get crud data
    getCrudData(refresh = false) {
      return new Promise((resolve, reject) => {
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            filter: {module: 'isite', entity: 'organization'}
          }
        }
        //Request
        this.$crud.index('apiRoutes.qsite.icruds', requestParams).then(response => {
          this.crudData = response.data.length ? response.data[0].projectCrud : false
          resolve(response.data)
        }).catch(error => reject(error))
      })
    },
    //Syn organization data
    syncOrganization() {
      return new Promise((resolve, reject) => {
        const layoutId = layoutStore().getSelectedLayout();
        if (layoutId) {
          this.form.layoutId = layoutId;
          layoutStore().setSelectedLayout(layoutId);
        }
        this.loading = true
        //Request
        this.$crud.update('apiRoutes.qsite.organizations', this.organization.id, this.form).then(response => {
          this.$alert.info({message: this.$tr('isite.cms.message.recordUpdated')})
          this.loading = false
          layoutStore().setSelectedFile();
        }).catch(error => {
          this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
          this.loading = false
        })
      })
    },
  }
}
</script>
<style lang="stylus">
</style>
