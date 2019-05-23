<template>
  <div id="siteForm" class="position-relative">
    <locales v-model="locale" ref="locales" @validate="$v.$touch()" v-show="hasTranslatables"></locales>

    <div
      v-for="(setting,index) in module"
      :key="index"
      v-if="locale.success">

      <field :key="index" :setting="setting" v-model="locale.formTemplate[setting.name]" :label="label(setting)"/>


    </div>


    <div class="col-12 text-right">
      <q-btn color="positive" :label="'Save: '+moduleName" icon="fas fa-save" @click="submit" class="q-my-sm"/>
    </div>

    <inner-loading :visible="submitModule" />

  </div>
</template>
<script>
  /*Plugins*/
  import {alert} from '@imagina/qhelper/_plugins/alert'

  /*Components*/
  import field from '@imagina/qsite/_components/field'
  import locales from '@imagina/qsite/_components/locales'
  import innerLoading from 'src/components/master/innerLoading'

  /*Services*/
  import siteService from '@imagina/qsite/_services/index'

  export default {
    props: {
      module: {
        type: Object,
        default: () => {
          return {}
        }
      },
      moduleName: {
        type: String,
        default: ''
      },
    },
    components: {
      field, locales, innerLoading
    },
    computed: {
      hasTranslatables() {
        for (const setting in this.module) {
          if (this.module[setting].translatable)
            return true
        }
        return false
      },
      hasNoTranslatables() {
        for (const setting in this.module) {
          if (!this.module[setting].translatable)
            return true
        }
        return false
      }
    },
    watch: {
      module() {
        this.transformToFrontData();
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.transformToFrontData();
      })
    },
    data() {
      return {
        locale: {},
        translatableCollapse: true,
        noTranslatableCollapse: true,
        submitModule: false,
        selectedLocales: this.$store.getters['site/getSettingValueByName']('core::locales'),
        defaultLocale: this.$store.getters['site/getDefaultLocale']
      }
    },
    methods: {

      submit() {
        this.submitModule = true
        let data = this.transformToBackData();
        siteService.updateOrCreate('apiRoutes.site.settings', data).then(response => {
          this.submitModule = false
          this.$emit('getData', true)
          alert.success('Module updated', 'top')
        }).catch(error => {
          this.submitModule = false
          alert.error('Module not updated', 'bottom', false, 2500)
        })
      },
      transformToBackData() {
        let data = {}

        for (const field in this.locale.fields) {
          data[field] = this.locale.form[field]

          // generating form locales by setting
          this.selectedLocales.forEach(locale => {
            for (const fieldTrans in this.locale.form[locale]) {
              if (!data[fieldTrans])
                data[fieldTrans] = {}

              data[fieldTrans][locale] = this.locale.form[locale][fieldTrans]

            }
          })
        }

        return data
      },

      transformToFrontData() {
        let form = {}
        let fields = {}
        let fieldsTranslatable = {}

        for (const settingKey in this.module) {

          let setting = this.module[settingKey];

          // generating form locales by setting
          this.selectedLocales.forEach(locale => {
            if (setting[locale]) {
              if (!form[locale])
                form[locale] = {}
              form[locale][setting.name] = setting[locale].value;
            }
          })

          // generating transtalable and not translatable fields
          if (setting.translatable) {
            fieldsTranslatable[setting.name] = setting.value
          } else {
            fields[setting.name] = setting.value
          }
        }

        this.locale.form = form
        this.locale.fields = fields
        this.locale.fieldsTranslatable = fieldsTranslatable
      },

      label(setting) {
        if (setting.translatable)
          return setting.description + ' (' + this.locale.language + ')';
        else
          return setting.description;
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>