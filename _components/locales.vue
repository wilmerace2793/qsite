<template>
  <q-btn-toggle
    class="no-shadow"
    v-model="response.language"
    toggle-color="primary"
    color="grey-2"
    text-color="grey-8"
    :options="this.$store.getters['site/getSelectedLocalesSelect']"
    @input="updateFormTempleate()"
  />
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
      'response.formTemplate': {
        deep: true,
        handler: function (newValue) {
          this.setDataByLocale()
        },
      },
      'response.form' : {
        deep: true,
        handler: function (newValue) {
          this.updateFormTempleate()
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
        response: {
          form: {},//Return data with format to request
          fields: {},//Fields not translatable
          loaded: false,//Status  component
          validations: {},//Fields to validate
          formTemplate: {},//Form with fields to render template
          formValidations: {},//Object with validations structure
          fieldsTranslatable: {},//Fields Translatable
          language: this.$store.state.site.defaultLocale,//Selected language in component
          languages: this.$store.state.site.selectedLocales,//Selected locales from admin
        }
      }
    },
    methods: {
      //Init component
      init() {
        //Merge data from v-model
        this.response = _cloneDeep(Object.assign(this.response, this.value))
        this.orderFields()//Order fields
        this.orderValidations()//Order validations
        this.updateFormTempleate()//Update data of form template about locale
        this.response.loaded = true//Status of component
        this.$emit('input', this.response)//Emit data
      },
      //Load fields on form and form template
      orderFields() {
        const response = _cloneDeep(this.response)//Clone response
        const locales = this.$store.state.site.selectedLocales//Get selected locales

        //Create fields translatble by locale
        let formLanguages = {}
        locales.forEach(locale => {
          formLanguages[locale] = _cloneDeep(response.fieldsTranslatable)
        })

        //Merge all fields with fields by locale
        this.response.form = _cloneDeep(Object.assign(formLanguages, response.fields, response.form))

        //Merge fields and fields translatable to formTemplate
        this.response.formTemplate = _cloneDeep(Object.assign(
          response.fields, response.fieldsTranslatable, response.formTemplate
        ))
      },
      //Order fields validations
      orderValidations() {
        if (Object.keys(this.response.validations).length) {
          this.response.formValidations = _cloneDeep({
            formTemplate: this.response.validations
          })
        }
      },
      //Set data from formTemplate in form by locale
      setDataByLocale() {
        const response = _cloneDeep(this.response)

        //Set fields not translatables
        for (var item in response.fields) {
          this.response.form[item] = _cloneDeep(response.formTemplate[item])
        }

        //Set fields translatables
        for (var item in response.fieldsTranslatable) {
          this.response.form[response.language][item] = _cloneDeep(response.formTemplate[item])
        }

        this.$emit('input', this.response)//Emit data
      },
      //Change data of form template about locale
      updateFormTempleate() {
        const response = _cloneDeep(this.response)

        console.warn('>>>>>>|||||||||',response.form)
        //Change form template for form by locale
        Object.keys(response.fields).forEach(fieldName => {
          console.warn(fieldName, response.form[fieldName])
        })

        //Emmit response
        this.$emit('input', this.response)
      },
      //Validate all fields
      vTouch() {
        if (Object.keys(this.response.validations).length) {
          const response = _cloneDeep(this.response)
          const currentLanguage = response.language

          for (var locale of this.response.languages) {
            this.response.language = locale//Change language
            this.updateFormTempleate()//Update form about language
            this.$v.$touch() //Touch validations
            //Check if fields is invalid
            if (this.$v.$error) {
              this.$emit('validate')
              return false
            } else {
              this.$v.$reset//Reset Validations
              this.response.language = currentLanguage//Set current language
            }
          }
        }
      },
      //Return obj to validate fields
      objValidations() {
        if (Object.keys(this.response.validations).length)
          return {response: _cloneDeep(this.response.formValidations)}
        else
          return {}
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>