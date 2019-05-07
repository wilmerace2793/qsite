<template>
  <div id="siteField">
    <q-field

    >
      <q-input autocomplete="false"
               v-model="setting.value"
               :type="setting.type"
               v-if="['select', 'selectMultiple','file','fileMultiple','color','checkbox'].indexOf(setting.type) < 0 "
               :float-label="setting.description"
               :rows="setting.type=='textarea' ? 3 : ''"/>
  
      <q-select
        filter
        chips
        v-model="setting.value"
        v-if="['select', 'selectMultiple'].indexOf(setting.type) >= 0"
        :float-label="setting.description"
        :multiple="setting.type == 'selectMultiple'"
        :options="options"
      />
      
      <q-color
        v-model="setting.value"
        format-model="hex"
        clearable modal
        :float-label="setting.description"
        v-if="setting.type == 'color'"/>
  
      <media-form
        v-if="['file', 'fileMultiple'].indexOf(setting.type) >= 0"
        :multiple="setting.type == 'fileMultiple'"
        entity="Modules\Settings\Entities\Setting"
        :entity-id="setting.id ? setting.id : ''"
        :label="setting.description"
      />
  
      <q-checkbox
        v-if="setting.type == 'checkbox'"
        v-model="setting.value"
        :label="setting.description" class="q-my-sm"/>
    </q-field>

  </div>
</template>
<script>
  import {alert} from '@imagina/qhelper/_plugins/alert'
  
  /*Components*/
  /*Components*/
  import mediaForm from '@imagina/qmedia/_components/form'
  
  export default {
    props: {
      setting: {
        type: Object,
        default: {}
      },
    },
    components: {
      mediaForm
    },
    computed: {
      options(){
        let name = this.setting.name.split('::')[1];
        let options = []
        switch (name){
          case 'template':
            options = this.$store.getters['site/availableThemesSelect']
            break;
          case 'locales':
            options = this.$store.getters['site/availableLocalesSelect']
            break;
        }
        return options
      }
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    methods: {}
    
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
