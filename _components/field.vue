<template>
  <div id="siteField">
    <q-field

    >
      <q-input autocomplete="false"
               v-model="setting.value"
               :type="setting.type"
               v-if="['select', 'select-multi','file','color','checkbox'].indexOf(setting.type) < 0 "
               :float-label="setting.description"
               :rows="setting.type=='textarea' ? 3 : ''"/>
  
      <q-select
        filter
        chips
        v-model="setting.value"
        v-if="['select', 'select-multi'].indexOf(setting.type) >= 0"
        :float-label="setting.description"
        :multiple="setting.type == 'select-multi'"
        :options="options"
      />
      
      <q-color
        v-model="setting.value"
        format-model="hex"
        clearable modal
        :float-label="setting.description"
        v-if="setting.type == 'color'"/>
  
      <media-form
        v-if="['file'].indexOf(setting.type) >= 0"
        :multiple="setting.type == 'file-multi'"
        entity="Modules\Setting\Entities\Setting"
        :zone="setting.name"
        v-model="setting.value.medias_single"
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
          default:
            if(this.setting.options)
              options = this.setting.options;
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
