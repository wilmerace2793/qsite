<template>
  <div id="siteForm">

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
  
   

  </div>
</template>
<script>
  import {alert} from '@imagina/qhelper/_plugins/alert'
  
  import field from '@imagina/qsite/_components/field'
  export default {
    props: {
      module: {
        type: Object,
        default: {}
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
      }
    },
    methods: {}
    
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>