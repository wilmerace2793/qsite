<template>
  <div id="settingIndex"
       class="q-layout-page row layout-padding">

    <!--TITLE-->
    <h1 class="q-headline text-primary">
      <q-icon name="fas fa-cog"></q-icon>
      Site
    </h1>

    <div class="col-12 backend-page relative-position">
      <div class="row gutter-x-sm">
        <div class="col-12 col-md-3 q-pr-sm">
          <q-list highlight link dense class="border-top-color">
            <q-list-header>Available Modules</q-list-header>
            <q-item
              v-for="(module,index) in modules"
              :key="index"
              @click.native="getSingleModule(index)"
              :class="nameModuleSelected == index ? 'router-link-exact-active router-link-active' : ''">
              <q-item-main :label="index"/>
              <q-item-side right>
                <q-chip color="primary" small>{{Object.keys(module).length}}</q-chip>

              </q-item-side>
            </q-item>


          </q-list>
        </div>
        <div class="col-12 col-md-9 border-top-color border">
          <site-form v-if="moduleSelected" :module="moduleSelected" :key="moduleKey" :module-name="nameModuleSelected"
                     @getData="getData"/>
        </div>
      </div>

      <!--Loading-->
      <inner-loading :visible="loadingModules" />
    </div>
  </div>
</template>
<script>
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import {uid} from 'quasar'

  /*Services*/
  import siteService from '@imagina/qsite/_services/index'

  /*Components*/
  import siteForm from '@imagina/qsite/_components/form'
  import innerLoading from 'src/components/master/innerLoading'

  export default {
    props: {},
    components: {
      siteForm, innerLoading
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.getData();
      })
    },
    data() {
      return {
        loadingModules: false,
        modules: null,
        moduleSelected: null,
        moduleKey: uid(),
        nameModuleSelected: 'Core'
      }
    },
    methods: {
      getData(refresh = false) {
        this.loadingModules = true
        let params = {
          params: {
            filter: {
              allTranslations: true
            },
          },
          remember: false
        }

        siteService.crud.index('apiRoutes.site.settings', params).then(response => {
          this.modules = response.data;
          this.getSingleModule(this.nameModuleSelected)
          this.loadingModules = false
        })

      },

      getSingleModule(name) {
        this.moduleKey = uid()
        this.moduleSelected = this.modules[name];
        this.nameModuleSelected = name;
        /*
        siteService.crud.show('apiRoutes.site.settings',name,{remember:false}).then(response => {
          this.moduleSelected = response.data;

        })
        */
      },

    }

  }
</script>
<style lang="stylus">
  @import "~variables";
  #settingIndex
    .border
      border 1px solid $grey-4
      border-top 3px solid $primary
</style>