<template>
  <div id="organizationFormPage">
    <!--Content-->
    <div v-if="organizationId" id="pageContent">
      <!--page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions :title="$tr($route.meta.title)" @refresh="getData(true)"/>
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
export default {
  props: {},
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
      form: {}
    }
  },
  computed: {
    //Organization data
    organizationId() {
      //return this.$clone(this.$store.state.quserAuth.organizationId)
      return this.$clone(this.$route.params.id)
    },
    //Parse crud data
    parseCrudData() {
      let crudData = this.$clone(this.crudData)

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
        if (!this.organizationId) return resolve(null)
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'fields,schedule.workTimes',
            filter: {allTranslations: true}
          }
        }
        //Request
        this.$crud.show('apiRoutes.qsite.organizations', this.organizationId, requestParams).then(response => {
          setTimeout(() => {
            this.organization = this.$clone(response.data)
            this.form = this.$clone(response.data)
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
        this.loading = true
        //Request
        this.$crud.update('apiRoutes.qsite.organizations', this.organization.id, this.form).then(response => {
          this.$alert.info({message: this.$tr('isite.cms.message.recordUpdated')})
          this.loading = false
        }).catch(error => {
          this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
          this.loading = false
        })
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
