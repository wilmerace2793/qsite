<template>
  <div id="componentLocales">
    <!--Label title-->
    <span class="capitalize text-blue-grey" v-if="languageOptions.length <= 1">
      <q-icon name="fas fa-language"/>
      {{$tr('ui.label.language')}}
    </span>
    <!--Button Config language-->
    <q-btn icon="fas fa-cog" class="config-buttom q-mr-xs capitalize"
           :label="`${$tr('ui.label.language')}`" color="blue-grey"
           @click="options.typeOption = null" no-caps v-else>
      <!--Popover-->
      <q-popover class="popover-config-locale backend-page" ref="modalConfig" persistent>
        <div class="content q-pa-sm">
          <!--Title-->
          <div class="title text-primary q-mb-md relative-positive">
            <q-icon name="fas fa-language" class="q-mr-xs"/>
            <span class="capitalize" v-html="$trp('ui.label.option')"/>
            <q-btn color="blue-grey" flat icon="fas fa-times"
                   @click="$refs.modalConfig.hide()"/>
          </div>
          <!--Option replace-->
          <q-radio v-model="options.typeOption" val="duplicate" :label="messageOpt.replace"/>
          <br>
          <!--Option duplicate-->
          <q-radio v-model="options.typeOption" val="replace" :label="messageOpt.duplicate"/>
          <!--Languages to clone-->
          <q-select
            v-if="options.typeOption == 'replace'"
            class="capitalize q-mt-xs"
            v-model="options.languageToClone"
            :stack-label="$trp('ui.label.language')"
            :options="optionsLanguagesToClone"
          />
          <!--Button clone language-->
          <div class="text-right q-mt-sm">
            <q-btn icon="fas fa-save" color="positive" size="sm" @click="makeOptionLocale()"
                   :label="$tr('ui.label.save')" :disable="!options.typeOption"/>
          </div>
        </div>
      </q-popover>
    </q-btn>
    <!--Button toogle with locales-->
    <q-btn-toggle
      class="no-shadow"
      v-model="locale.language"
      toggle-color="primary"
      color="grey-2" size="12px"
      text-color="grey-8"
      :options="languageOptions"
      @input="updateFormTempleate()"
    />
  </div>
</template>

<script>
  //plugins
  import _cloneDeep from 'lodash.clonedeep'

  export default {
    props: {
      value: {
        default: () => {
          return {}
        }
      }
    },
    components: {},
    watch: {
      //Watch form template from value, to update form by locale
      'value.formTemplate': {
        deep: true,
        handler: function (newValue) {
          this.setDataByLocale()//Set data in form by locale
        },
      },
      //Watch form from value, to init
      'value.form': {
        deep: true,
        handler: function (newValue) {
          this.init()//init all locale data
        },
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    validations() {
      return this.objValidations()
    },
    data() {
      return {
        languageOptions: this.$store.getters['qsiteSettings/getSelectedLocalesSelect'],
        options: {
          typeOption: null,//type of option acoording language selected
          languageToClone: null//Language to clone data
        },
        locale: {
          form: {},//Return data with format to request
          fields: {},//Fields not translatable
          success: false,//Status  component
          validations: {},//Fields to validate
          formTemplate: {},//Form with fields to render template
          formValidations: {},//Object with validations structure
          fieldsTranslatable: {},//Fields Translatable
          language: this.$store.state.qsiteSettings.defaultLocale,//Selected language in component
          languages: this.$store.state.qsiteSettings.selectedLocales,//Selected locales from admin
        }
      }
    },
    computed: {
      //Return message to complete language config
      messageOpt() {
        let language = this.locale.language
        let label = this.languageOptions.find(item => item.value == language).label
        return {
          replace: this.$t('qsite.layout.messages.replaceLang', {lang: label}),
          duplicate: this.$t('qsite.layout.messages.duplicateLang', {lang: label})
        }
      },
      //Option languages to clone data
      optionsLanguagesToClone() {
        let response = []
        this.languageOptions.forEach(lang => {
          if (lang.value != this.locale.language)
            response.push(this.$clone(lang))
        })
        //Select first language
        this.options.languageToClone = response[0].value
        return response//Response
      },
      //Merge value and locale data
      interfaceSet() {
        const data = _cloneDeep(this.value)
        const locale = _cloneDeep(this.locale)
        this.locale = _cloneDeep(Object.assign(locale, data))
      },
      //Return clone from locale data
      interfaceGet() {
        return _cloneDeep(this.locale)
      },
      //Return clone from value data
      interfaceGetValue() {
        return _cloneDeep(this.value)
      },
      //Emmit a clone from locale data
      async interfaceEmit() {
        //Check if there is fields in from template to change status from component
        const lengthFormTemplate = Object.keys(this.locale.formTemplate).length
        this.locale.success = lengthFormTemplate ? true : false
        //Emmit data
        await this.$emit('input', _cloneDeep(this.locale))
      },
      //check if form template is same in value and local
      formTemplateIsSame() {
        const locale = this.interfaceGet//Get clone local data
        const value = this.interfaceGetValue//Get clone value data
        let response = false//Response
        if (!locale.formTemplate) return response
        if (JSON.stringify(locale.formTemplate) == JSON.stringify(value.formTemplate))
          response = true
        return response//Response
      },
      //check if form is same in value and local
      formIsSame() {
        const locale = this.interfaceGet//Get clone local data
        const value = this.interfaceGetValue//Get clone value data
        let response = false//Response
        //not is same if there is not form
        if (!locale.form) return response
        //not is same if empty form
        if (!Object.keys(locale.form).length) return response
        if (JSON.stringify(locale.form) == JSON.stringify(value.form))
          response = true
        return response//Response
      }
    },
    methods: {
      //Init component
      init() {
        if (!this.formIsSame) {
          this.interfaceSet//Set data form value
          this.orderFields()//Order fields
          this.orderValidations()//Order validations
          this.updateFormTempleate()//Update data of form template according to locale
          this.interfaceEmit//Emit clone of locale data
        }
      },
      //Load fields on form and form template
      orderFields() {
        const locale = _cloneDeep(this.locale)//Clone locale
        const locales = this.$store.state.qsiteSettings.selectedLocales//Get selected locales from store
        this.setFormTemplate(Object.assign({}, locale.fields, locale.fieldsTranslatable))//Set fromTemplate

        //Create and sync fields translatable by locale
        let fieldsTranslatable = {}
        locales.forEach(language => {
          if (locale.form[language])//Sync fields translatable from form
            Object.keys(locale.form[language]).forEach(fieldName => {
              if (!fieldsTranslatable[language]) fieldsTranslatable[language] = {}
              fieldsTranslatable[language][fieldName] = locale.form[language][fieldName]
            })
          else//Set default fields translatable
            fieldsTranslatable[language] = _cloneDeep(locale.fieldsTranslatable)
        })

        //Create or sync fields with fields from form
        let fields = {}
        Object.keys(locale.fields).forEach(field => {
          fields[field] = (locale.form[field] != undefined) ? locale.form[field] : locale.fields[field]
        })

        //Merge all fields with fields by locale
        this.locale.form = _cloneDeep(Object.assign({}, fields, fieldsTranslatable))
      },
      //Order fields validations
      orderValidations() {
        //Order validations by locale
        if (Object.keys(this.locale.validations).length) {
          this.locale.formValidations = _cloneDeep({
            formTemplate: this.locale.validations
          })
        }
      },
      //Set data from formTemplate in form by locale
      setDataByLocale() {
        if (!this.formTemplateIsSame) {
          this.syncFormTemplate()//Sync data formTemplate
          const locale = this.interfaceGet//Get clone local data
          const value = this.interfaceGetValue//Get clone value data

          //Set fields not translatables
          for (var item in locale.fields) {
            locale.form[item] = locale.formTemplate[item]
          }

          //Set fields translatables
          for (var item in locale.fieldsTranslatable) {
            locale.form[locale.language][item] = locale.formTemplate[item]
          }

          this.locale.form = _cloneDeep(locale.form)
          this.interfaceEmit//Emit data
        }
      },
      //Sync form template
      syncFormTemplate() {
        const locale = this.interfaceGet//Get clone local data
        const value = this.interfaceGetValue//Get clone value data
        this.setFormTemplate(Object.assign({}, locale.formTemplate, value.formTemplate))//Set form Template
      },
      //Change data of form template about locale
      updateFormTempleate() {
        const locale = this.interfaceGet
        //Change fields by locale of form template
        Object.keys(locale.fieldsTranslatable).forEach(fieldName => {
          locale.formTemplate[fieldName] = locale.form[locale.language][fieldName]
        })

        //Change fields of form template
        Object.keys(locale.fields).forEach(fieldName => {
          locale.formTemplate[fieldName] = _cloneDeep(locale.form[fieldName])
        })

        this.setFormTemplate(locale.formTemplate)//Set form template
        this.interfaceEmit//Emit data
      },
      //Set formTemplate
      setFormTemplate(val = []) {
        let values = this.$clone(val)//Clone param

        //Check if exist options and decode it
        if (values.options && (typeof values.options == 'string'))
          values.options = JSON.parse(values.options)

        //Set formTemplate
        this.locale.formTemplate = this.$clone(values);
      },
      //Return obj to validate fields
      objValidations() {
        if (Object.keys(this.locale.validations).length)
          return {locale: _cloneDeep(this.locale.formValidations)}
        else
          return {}
      },
      //Validate all fields
      vTouch() {
        if (Object.keys(this.locale.validations).length) {
          const locale = _cloneDeep(this.locale)
          const currentLanguage = locale.language

          for (var locale of this.locale.languages) {
            this.locale.language = locale//Change language
            this.updateFormTempleate()//Update form about language
            this.$v.$touch() //Touch validations
            //Check if fields is invalid
            if (this.$v.$error) {
              this.$emit('validate')
              return false
            } else {
              this.$v.$reset//Reset Validations
              this.locale.language = currentLanguage//Set current language
            }
          }
        }
      },
      //Reset
      async vReset() {
        //Reset locale
        this.locale = Object.assign({}, this.interfaceGet, {
          form: {},//Return data with format to request
          success: false,//Status  component
          formTemplate: {},//Form with fields to render template
          formValidations: {},//Object with validations structure
        })
        await this.interfaceEmit//Emit locale
        this.init()//Init locale
      },
      //Replace o duplicate locale
      makeOptionLocale() {
        const locale = this.interfaceGet//Get clone local data
        let typeOption = this.options.typeOption//Get type option

        //Case of action options
        switch (typeOption) {
          case 'replace'://Replace info locale acoording other
            let languageToClone = this.options.languageToClone
            for (var item in locale.fieldsTranslatable) {
              locale.form[locale.language][item] = locale.form[languageToClone][item]
            }
            break;
          case 'duplicate'://Duplicate data of current locale to all locales
            locale.languages.forEach(lang => {
              for (var item in locale.fieldsTranslatable) {
                locale.form[lang][item] = locale.form[locale.language][item]
              }
            })
            break;
        }

        this.$refs.modalConfig.hide()//close popover options
        this.locale.form = _cloneDeep(locale.form)//sync locale
        this.updateFormTempleate()//Update for template
      }
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
  #componentLocales
    .config-buttom
      min-height 30px
      padding 4px 12px

      .q-icon
        margin-right 5px
        font-size 14px

  .popover-config-locale
    .content
      max-height 90vh !important

      .title
        .q-btn
          position absolute
          top 0
          right 0

</style>
