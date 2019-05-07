<template>
  <div id="siteForm" class="position-relative">

    <q-card class="q-box no-shadow col-12 q-mb-sm" v-if="hasTranslatables">
    
      <q-card-title class="no-border q-py-none bg-grey-2">
        <div class="row justify-between">
          <div class="q-subheading text-primary">
            Translatable Settings
          </div>
          <q-toggle
            v-model="translatableCollapse"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            style="margin-left: 25px"
          />
        </div>
    
      </q-card-title>
      <q-collapsible header-style="display: none" v-model="translatableCollapse">
        <div
          v-for="(setting,index) in module"
          :key="index"
          v-if="setting.translatable">
          
          <field :setting="setting" />
       
          
        </div>
      </q-collapsible>
    </q-card>

    <q-card class="q-box no-shadow col-12 q-mb-sm" v-if="hasNotTranslatables">
    
      <q-card-title class="no-border q-py-none bg-grey-2">
        <div class="row justify-between">
          <div class="q-subheading text-primary">
            No Translatable Settings
          </div>
          <q-toggle
            v-model="noTranslatableCollapse"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            style="margin-left: 25px"
          />
        </div>
    
      </q-card-title>
      <q-collapsible header-style="display: none" v-model="noTranslatableCollapse">
        <div
          v-for="(setting,index) in module"
          :key="index"
          v-if="!setting.translatable">
          
          <field :setting="setting" />
          
        </div>
      </q-collapsible>
    </q-card>
    
    <div class="col-12 text-right">
      <q-btn color="primary" :label="'Save: '+moduleName" size="sm" @click="submit" class="q-my-sm"/>
    </div>
  
    <q-inner-loading :visible="submitModule">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>

  </div>
</template>
<script>
  /*Plugins*/
  import {alert} from '@imagina/qhelper/_plugins/alert'

  /*Components*/
  import field from '@imagina/qsite/_components/field'

  /*Services*/
  import siteService from '@imagina/qsite/_services/index'
  
  export default {
    props: {
      module: {
        type: Object,
        default: () => {return {}}
      },
      moduleName: {
        type: String,
        default: ''
      },
    },
    components: {
      field
    },
    computed: {
      hasTranslatables(){
        for (const setting in this.module) {
          if(this.module[setting].translatable)
            return true
        }
        return false
      },
      hasNotTranslatables(){
        for (const setting in this.module) {
          if(!this.module[setting].translatable)
            return true
        }
        return false
      }
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        translatableCollapse: true,
        noTranslatableCollapse: true,
        submitModule: false,
        selectedLocales: this.$store.getters['site/getSettingValueByName']('core::locales'),
        defaultLocale: this.$store.getters['site/getDefaultLocale']
      }
    },
    methods: {
      submit(){
        this.submitModule = true
        let data = this.transformData();
        
        siteService.updateOrCreate('apiRoutes.site.settings',data).then(response => {
          this.submitModule = false
          alert.success('Module updated', 'top')
        }).catch(error => {
          this.submitModule = false
          alert.error('Module not updated', 'bottom', false, 2500)
        })
      },
      transformData(){
        let data = {}
        for (const settingName in this.module){
          let setting = this.module[settingName];
          if(setting.isTranslatable){
            data[setting.name] = {}
            this.selectedLocales.forEach(locale => {
              if(setting[locale])
                data[setting.name][locale] = setting[locale].value
              else
                data[setting.name][this.defaultLocale] = setting.value
            })
          }else{
            if(!setting.type=='file' || setting.value.medias_single[setting.name]!='')
              data[setting.name] = setting.value
          }
        }
        return data
      }
      
    }
    
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>