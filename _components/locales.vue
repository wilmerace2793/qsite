<template>
  <div id="localesComponent">
    <q-btn-toggle
      class="no-shadow"
      v-model="response.language"
      toggle-color="primary"
      color="grey-2"
      text-color="grey-8"
      :options="this.$store.getters['site/getSelectedLocalesSelect']"
      @input="updateFormTempleate()"
    />
  </div>
</template>
<script>
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
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        response: {
          language: this.$store.state.site.defaultLocale,
          form: {},
          formTemplate: {},
          fields: {},
          fieldsTranslatable: {}
        }
      }
    },
    methods: {
      //Init component
      init() {
        //Merge data from v-model
        this.response = Object.assign(this.response, this.value)
        this.orderFields()//Order fields
        this.$emit('input', this.response)//Emit data
      },
      //Load fields on form and form template
      orderFields() {
        const response = Object.assign({}, this.response)//Clone response
        const locales = this.$store.state.site.selectedLocales//Get selected locales

        //Create fields translatble by locale
        let formLanguages = {}
        locales.forEach(locale => {
          formLanguages[locale] = Object.assign({}, response.fieldsTranslatable)
        })

        //Merge all fields with fields by locale
        this.response.form = Object.assign(formLanguages, this.response.form, response.fields)

        //Merge fields and fields translatable to formTemplate
        this.response.formTemplate = Object.assign(
          response.fields, response.fieldsTranslatable, response.formTemplate
        )
      },
      //Set data from formTemplate in form by locale
      setDataByLocale() {
        const response = Object.assign({}, this.response)

        //Get from form templeta just fields translatables
        let fieldsData = {}
        for (var item in response.fieldsTranslatable) {
          fieldsData[item] = response.formTemplate[item]
        }

        //Set data in form by locale
        this.response.form[response.language] = fieldsData
        this.$emit('input', this.response)//Emit data
      },
      //Change data of form template about locale
      updateFormTempleate() {
        const response = Object.assign({}, this.response)
        //Change form template for form by locale
        this.response.formTemplate = response.form[response.language]
        this.$emit('input', this.response)//Emmit response
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>