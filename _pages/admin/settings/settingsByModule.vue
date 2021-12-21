<template>
  <div id="settingPage" class="relative-position">
    <!--Empty result-->
    <not-result class="q-my-md" v-if="!loading && !dataSettings"/>
    <!--Content-->
    <div class="row q-col-gutter-md" v-else>
      <!--Page Actions-->
      <div class="col-xs-12">
        <div class="box box-auto-height">
          <page-actions :title="titlePage" @refresh="getData"/>
        </div>
      </div>
      <!--Form-->
      <div class="col-12">
        <!--Form-->
        <dynamic-form v-if="!loading && formBlocks.length" v-model="form" :blocks="formBlocks" form-type="grid"
                      @submit="saveSettings()" :form-col-number="1"/>
        <!--Empty results-->
        <not-result class="box box-auto-height" v-else/>
      </div>
    </div>
    <!--Loading-->
    <inner-loading :visible="loading"/>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {
    '$route.name'(newValue) {
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
      form: {},
      locale: {fields: {}, fieldsTranslatable: {}},
      dataSettings: false,
      moduleSelected: false,
      groupSelected: false,
      settingsToEdit: [],
      deprecatedSettings: [],
      groupsName: {}
    }
  },
  computed: {
    //Return main config from current route
    mainConfig() {
      return this.$route.meta.mainConfig
    },
    //Return Page Title, according to mainConfig parameter mainConfig
    titlePage() {
      let response = this.$tr('ui.label.personalization')
      if (this.mainConfig.moduleTitle) response += ` | ${this.$tr(this.mainConfig.moduleTitle)}`
      return response
    },
    //Return setting assigned settings
    assignedSettings() {
      let userSettings = this.$store.state.quserAuth.settings || {}
      let assignedSettings = userSettings.assignedSettings || []
      return Array.isArray(assignedSettings) ? assignedSettings : []
    },
    //Return settings group
    settingsGroup() {
      let response = {} //Default response
      this.groupsName = {}// reset group names
      let settings = this.$clone(this.dataSettings)

      //Group fields
      Object.keys(settings).forEach(moduleName => {
        response[moduleName] = {General: {}}//Default module
        Object.keys(settings[moduleName]).forEach(fieldName => {
          let field = settings[moduleName][fieldName]//Get field
          //Create group fields
          //Set group name
          if (!this.groupsName[moduleName]) this.groupsName[moduleName] = {}
          this.groupsName[moduleName][field.groupName || 'General'] = (field.groupTitle || 'General')
          //validate ig group already exist
          if (!response[moduleName][field.groupName || 'General']) response[moduleName][field.groupName || 'General'] = {}
          //Add field
          if (!this.deprecatedSettings.includes(field.name) && !this.deprecatedSettings.includes(field.fakeFieldName))
            response[moduleName][field.groupName || 'General'][fieldName] = field
        })
      })

      //Validate assigned settings
      if (this.assignedSettings.length) {
        Object.keys(response).forEach(moduleName => {
          Object.keys(response[moduleName]).forEach(moduleGroupName => {
            Object.keys(response[moduleName][moduleGroupName]).forEach(settingName => {
              let setting = response[moduleName][moduleGroupName][settingName]
              if (!this.assignedSettings.includes(setting.fakeFieldName || setting.name))
                delete response[moduleName][moduleGroupName][settingName]
            })
          })
        })
      }

      //Validate empty groups
      Object.keys(response).forEach(moduleName => {
        let keepModule = false
        //Validate if some child group has settings
        Object.keys(response[moduleName]).forEach(moduleGroupName => {
          if (Object.keys(response[moduleName][moduleGroupName]).length) keepModule = true
        })
        //Delete module from data
        if (!keepModule) delete response[moduleName]
      })

      //Response
      return response
    },
    //Return form fields settings to edit
    formBlocks() {
      let blocks = []

      //Custom settings fields
      if (Object.keys(this.settingsToEdit).length) {
        blocks.push({title: 'General', fields: this.$clone(this.settingsToEdit)})
      } else {//Get module settgins
        //Get module name
        let modulesToLoadSettings = (this.mainConfig.modulesSettings || this.mainConfig.moduleName)
        //Get settings
        Object.keys(this.settingsGroup).forEach(moduleName => {
          if (modulesToLoadSettings.includes(moduleName.toLowerCase())) {
            Object.keys(this.settingsGroup[moduleName]).forEach(groupName => {
              //Search by group in blocks
              let groupIndex = blocks.findIndex(item => item.groupName == groupName)
              //Merge gields at same group
              if (groupIndex >= 0) {
                blocks[groupIndex].fields = {
                  ...blocks[groupIndex].fields,
                  ...this.settingsGroup[moduleName][groupName]
                }
              } else {//Add new group
                blocks.push({
                  groupName: groupName,
                  title: this.groupsName[moduleName][groupName],
                  fields: this.settingsGroup[moduleName][groupName]
                })
              }
            })
          }
        })
      }

      //Set extra data to every field
      blocks.forEach((block, keyBlock) => {
        Object.keys(block.fields).forEach(fieldName => {
          blocks[keyBlock].fields[fieldName] = {
            ...block.fields[fieldName],
            fieldItemId: this.getSettingId(block.fields[fieldName], fieldName)
          }
        })
      })

      //response
      return blocks
    }
  },
  methods: {
    //Init method
    async init() {
      await this.getData()//Get data
      this.openSettingName()//Open default group
    },
    //Get Data
    getData() {
      return new Promise(async resolve => {
        this.loading = true
        await Promise.all([
          this.$store.dispatch('qsiteApp/GET_SITE_SETTINGS'),//Get settings
          this.getSettingFields(),//Get setting fields
          this.getDeprecatedSettings()//Get seprecated settings
        ])
        //Set Default selected
        if (!this.moduleSelected && this.dataSettings) {
          this.moduleSelected = Object.keys(this.settingsGroup)[0]//Set module selected
          //Set group selected
          if (!this.groupSelected) this.groupSelected = Object.keys(this.settingsGroup[this.moduleSelected])[0]
        }
        this.$store.dispatch('qsiteApp/SET_SITE_COLORS')//Set colors
        this.setFormData()//Set form data
        this.loading = false
        resolve(true)
      })
    },
    //Get settings Fields
    getSettingFields() {
      return new Promise((resolve, reject) => {
        this.dataSettings = false//Reset data settings
        //Request Params
        let requestParams = {
          refresh: true,
          params: {filter: {allTranslations: true, configNameByModule: 'settings-fields'}}
        }
        //Request
        this.$crud.index('apiRoutes.qsite.configs', requestParams).then(response => {
          //Default settings fields
          let settingsFields = {}

          //Get only settings fields from configs
          if (response.data) {
            for (var moduleName in response.data) {
              let fields = response.data[moduleName]
              if (fields && Object.keys(fields).length) settingsFields[moduleName] = fields
            }
          }

          //Set settings fields
          if (Object.keys(settingsFields).length) this.dataSettings = settingsFields
          resolve(response.data)
        }).catch(e => {
          this.$alert.error(this.$tr('ui.message.errorRequest'))
          resolve([])
        })
      })
    },
    //Get deprecate settings config
    getDeprecatedSettings() {
      return new Promise((resolve, reject) => {
        //Request Params
        let requestParams = {
          refresh: true,
          params: {filter: {configName: 'isite.deprecated-settings'}}
        }
        //Request
        this.$crud.index('apiRoutes.qsite.configs', requestParams).then(response => {
          this.deprecatedSettings = this.$clone(response.data)
          resolve(response.data)
        }).catch(e => {
          this.$alert.error(this.$tr('ui.message.errorRequest'))
          resolve([])
        })
      })
    },
    //Set form Data
    setFormData() {
      let formData = {}//instance form data
      let settingValues = this.$clone(this.$store.state.qsiteApp.settings)//Get all setting values
      let defaultLocale = this.$clone(this.$store.state.qsiteApp.defaultLocale)//Get selected locales
      let selectedLocales = this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
      selectedLocales.forEach(item => formData[item] = {})//set locales to formData

      //Get all formFields from blocks
      let formFields = []
      this.formBlocks.forEach(item => formFields = {...formFields, ...item.fields})

      //Format settings
      Object.values(formFields).forEach(field => {
        //Get setting field
        let setting = settingValues.find(item => item.name == (field.fakeFieldName || field.name))//Get setting value
        //Set by language
        if (field.isTranslatable) {
          selectedLocales.forEach(lang => {
            let value = setting.translations ? setting.translations.find(item => item.locale == lang) : null
            try {
              formData[lang][setting.name] = value ? JSON.parse(value.value) : setting.value
            } catch (err) {
              formData[lang][setting.name] = value ? value.value : setting.value
            }
          })
        } else formData[setting.name] = setting.value
      })

      //Set form data
      setTimeout(() => this.form = this.$clone(formData), 50)
    },
    //Return item Id to field
    getSettingId(field, key) {
      //Get setting name
      let settingName = field.fakeFieldName || field.name || key
      //Get all setting values
      let settingValue = this.$store.state.qsiteApp.settings.find(item => item.name == settingName)
      //Response
      return settingValue ? settingValue.id : null
    },
    //Get dataForm. order settings data to backend
    getDataForm() {
      let formData = this.$clone(this.form)//Get form data
      let selectedLocales = this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
      let response = {}//Default response

      Object.keys(formData).forEach(fieldName => {
        //Set no translatable fields
        if (selectedLocales.indexOf(fieldName) == -1) response[fieldName] = formData[fieldName]
        else {//Set translatables values. Order translate values
          Object.keys(formData[fieldName]).forEach(transfieldName => {
            if (!response[transfieldName]) response[transfieldName] = {}
            response[transfieldName][fieldName] = (typeof formData[fieldName][transfieldName] == 'string') ?
                formData[fieldName][transfieldName] : JSON.stringify(formData[fieldName][transfieldName])

          })
        }
      })

      //Response
      return response
    },
    //Save settings
    saveSettings() {
      this.loading = true
      //Request
      this.$crud.post('apiRoutes.qsite.settings', {attributes: this.getDataForm()}).then(async response => {
        this.$alert.info(this.$tr('ui.message.recordUpdated'))
        this.getData()
      }).catch(error => {
        this.$alert.error(this.$tr('ui.message.recordNoUpdated'))
        console.error('[UPDATE-SETTINGS]::error:', error)
        this.loading = false
      })
    },
    //Open setting name
    openSettingName() {
      this.settingsToEdit = []//Reset settings module
      let moduleName = this.$route.query.module//Get setting from URL
      let groupName = this.$route.query.group//Get settings name from url
      let settingsName = this.$route.query.settings//Get settings name from url

      //Get settings by module name
      let moduleSettings = this.$clone(this.settingsGroup[this.$helper.toCapitalize(moduleName || '')])

      if (moduleSettings) {
        let settingsToEdit = {}//Reset settings to edit
        //Search by setting name
        if (settingsName) {
          //Add module name to every setting name
          settingsName = settingsName.split(',').map(item => `${moduleName.toLowerCase()}::${item}`)
          //Search setting by name
          Object.keys(moduleSettings || []).forEach(moduleGroupName => {
            Object.keys(moduleSettings[moduleGroupName]).forEach(settingName => {
              let setting = moduleSettings[moduleGroupName][settingName]
              if (settingsName.includes(setting.name) || settingsName.includes(setting.fakeFieldName)) {
                settingsToEdit[settingName] = setting
              }
            })
          })
        }

        //Open group settings
        groupName = Object.keys(moduleSettings).includes(groupName) ? groupName : Object.keys(moduleSettings).pop()
        this.settingsToEdit = settingsToEdit
      }
    }
  }
}
</script>
<style lang="stylus">
#settingPage
  .q-item
    font-size 14px
    color $grey-9

    &.q-item--active
      color $primary

      .q-icon
        color $primary
</style>
