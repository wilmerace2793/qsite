<template>
  <div id="organizationFormPage">
    <!--Content-->
    <div id="pageContent" class="relative-position">
      <!--page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions :title="$tr($route.meta.title)" @refresh="getData(true)"/>
      </div>
      <!--dynamic form-->
      <dynamic-form v-if="crudData" :blocks="crudData.form.blocks" form-type="grid"/>
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      crudData: false
    }
  },
  computed: {},
  methods: {
    init() {
      this.getData()
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Requets params
        let requestParams = {
          refresh: refresh,
          filter: {module: 'isite', entity: 'organization'}
        }
        //Request
        this.$crud.index('apiRoutes.qsite.icruds', requestParams).then(response => {
          this.crudData = response.data.length ? response.data[0].projectCrud : false
          //console.warn(this.crudData)
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
