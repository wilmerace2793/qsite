<template>
  <div id="dynamicFormComponent">
    <div id="dynamicFormComponentContent" class="relative-position" :key="componentId">
      <!--Top Content-->
      <div id="topContent" v-if="!hideTitle">
        <!--Title-->
        <div class="box-title text-center q-mb-md" v-if="formProps.title" v-html="formProps.title"></div>
        <!--Description-->
        <div class="text-body2 q-mb-md text-grey-8" v-if="formProps.description" v-html="formProps.description"></div>
      </div>

      <!--Progress bar-->
      <div id="progressContent" class="q-mb-md" v-if="!hideProgressBar">
        <q-linear-progress :value="progress" color="primary" rounded/>
      </div>

      <!--Form Content-->
      <q-form autocorrect="off" autocomplete="off" ref="formContent" class="full-width" v-if="success"
              @validation-error="$alert.error($tr('ui.message.formInvalid'))">
        <!--Language-->
        <div class="q-mb-md" v-show="locale.fieldsTranslatable && Object.keys(locale.fieldsTranslatable).length">
          <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
        </div>
        <!--Stepper content-->
        <q-stepper id="stepperContent" v-model="step" v-if="locale.success" color="primary" ref="stepper"
                   flat animated :vertical="formType == 'stepVertical' ? true : false"
                   :header-class="formType == 'stepVertical' ? '' : 'q-hide'">
          <!--Steps-->
          <q-step v-for="(block, keyBlock) in blocksData" :key="keyBlock" :name="keyBlock"
                  :title="block.title || `#${keyBlock+1}`" :class="allowNavigation ? 'cursor-pointer' : ''">
            <!--Top step Info-->
            <div class="step-top-content" v-if="block.title || block.description">
              <!--Title-->
              <div class="box-title text-center q-mb-md" v-if="block.title && (formType != 'stepVertical')">
                {{ block.title }}
              </div>
              <!--Description-->
              <div class="text-body2 q-mb-md text-grey-8" v-if="block.description">{{ block.description }}</div>
            </div>
            <!--Fields-->
            <div class="row q-col-gutter-x-md q-mb-sm">
              <div v-for="(field, key) in block.fields" :key="key"
                   :class="field.children ? 'col-12' : (field.colClass || defaultColClass)">
                <!--fake field-->
                <dynamic-field v-if="field.fakeFieldName" :field="field" :key="key" :language="locale.language"
                               v-model="locale.formTemplate[field.fakeFieldName][field.name || key]"
                               :item-id="field.fieldItemId"/>
                <!--Sample field-->
                <dynamic-field v-else :field="field" :key="key" :item-id="field.fieldItemId"
                               v-model="locale.formTemplate[field.name || key]" :language="locale.language"/>
                <!--Child fields-->
                <div v-if="field.children">
                  <!--Title-->
                  <div class="text-blue-grey q-mb-xs">
                    <b>{{ field.label }} <label v-if="field.isTranslatable">({{ locale.language }})</label></b>
                  </div>
                  <!---Child fields-->
                  <div class="row q-col-gutter-x-md">
                    <div v-for="(childField, childKey) in getParsedFields(field.children)" :key="childKey"
                         :class="childField.colClass || defaultColClass">
                      <!--Child field-->
                      <dynamic-field :field="childField" :key="childKey" :language="locale.language"
                                     v-model="locale.formTemplate[field.name || key][childField.name || childKey]"
                                     :item-id="childField.fieldItemId"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--Actions-->
            <div :class="`actions__content row justify-${step == 0 ? 'end' : 'between'}`" v-if="!noActions">
              <q-btn v-for="(action, keyAction) in formActions" :key="keyAction" v-bind="action"
                     unelevated rounded no-caps @click="action.action(keyBlock)" type="button"
                     v-if="action.vIf != undefined ? action.vIf : true"/>
            </div>
          </q-step>
        </q-stepper>
      </q-form>

      <!--Innerloading-->
      <inner-loading :visible="(loading || innerLoading) ? true : false"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: () => {
        return {}
      }
    },
    loading: {type: Boolean, default: false},
    formType: {type: String, default: 'stepHorizontal'},
    title: {default: false},
    description: {default: false},
    blocks: {default: false},
    allowNavigation: {type: Boolean, default: false},
    formId: {default: false},
    sendTo: {default: false},
    actions: {default: false},
    defaultColClass: {default: 'col-12 col-md-6'},
    useCaptcha: {type: Boolean, default: false},
    hideTitle: {type: Boolean, default: false},
    hideProgressBar: {type: Boolean, default: false},
    noActions: {type: Boolean, default: false}
  },
  watch: {
    value: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) this.setLocaleFormData()
      }
    },
    blocks: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) this.setLocaleFields()
      }
    },
    'locale.form': {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
          this.$emit('input', this.$clone(this.locale.form))
        }
      }
    },
    formId() {
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
      success: false,
      componentId: this.$uid(),
      locale: {},
      step: 0,
      innerLoading: false,
      formBlocks: false
    }
  },
  computed: {
    //Settings
    settings() {
      return {
        defaultLocale: this.$clone(this.$store.state.qsiteApp.defaultLocale),//Get selected locales
        locales: this.$clone(this.$store.state.qsiteApp.selectedLocales)//Get selected locales
      }
    },
    //From Props
    formProps() {
      //Get form data
      let form = this.$clone(this.formBlocks)

      //Default response
      let response = {
        title: this.$clone(this.title),
        description: this.$clone(this.description),
      }

      //Set info from form
      if (form) response.title = form.title

      //Add count steps
      if (this.blocksData.length >= 2)
        response.title = `${form.title || response.title} (${this.step + 1}/${this.blocksData.length})`

      //Response
      return response
    },
    //BlocksData
    blocksData() {
      let blocks = this.$clone(this.blocks || [])
      let form = this.$clone(this.formBlocks)

      if (form && form.blocks) {
        //Get dynamic field by blocks from form
        form.blocks.forEach((block, index) => {
          form.blocks[index].fields = form.blocks[index].fields.map(field => field.dynamicField)
        })
        //Merge blocks
        blocks = [...blocks, ...form.blocks]
      }

      //Add captcha field
      if (this.useCaptcha && blocks.length) blocks[blocks.length - 1].fields.captcha = {type: 'captcha'}

      //Validate if field should be translatable
      blocks.forEach((block, blockKey) => {
        let blockFields = this.$clone(block.fields)//get block fields
        let parsedFields = this.getParsedFields(blockFields)//Parse fields

        //Get translatable fields
        let translatableFields = []//Translatable fields name
        for (var key in parsedFields) {
          if (parsedFields[key].isTranslatable)
            translatableFields.push(parsedFields[key].fakeFieldName || parsedFields[key].name || key)
        }

        //Parse block fields
        for (var key in blockFields) {
          let field = blockFields[key]
          //validate first level
          if (translatableFields.includes(field.fakeFieldName || field.name || key))
            blockFields[key].isTranslatable = true
          //Validate children fields
          if (field.children) {
            for (var keyChild in field.children) {
              let fieldChild = blockFields[key].children[keyChild]
              //validate first level
              if (translatableFields.includes(fieldChild.fakeFieldName || fieldChild.name || keyChild))
                blockFields[key].children[keyChild].isTranslatable = true
            }
          }
        }

        //Set fields to blocks
        blocks[blockKey].fields = this.$clone(blockFields)
      })

      //Response
      return blocks
    },
    //Form progress
    progress() {
      let totalStep = this.blocksData.length//Get total steps
      let valuePerStep = parseFloat(1 / totalStep).toFixed(1) // Get value per step

      //Return progress value
      if (this.step == 0) return parseFloat(valuePerStep)//To first step
      else if (this.step == (totalStep - 1)) return 1//To last step
      else return parseFloat(parseFloat(valuePerStep * (this.step + 1)).toFixed(1))//To middle step
    },
    //Step actions
    formActions() {
      //Default actions config
      let actions = {
        previous: {
          color: "grey-6",
          icon: this.formType == 'stepVertical' ? "fas fa-arrow-up" : "fas fa-arrow-left",
          label: this.$tr('ui.label.previous'),
          ...(this.actions.previous || {}),
          vIf: (this.step == 0) ? false : true,
          action: () => this.changeStep('previous')
        },
        next: {
          color: "green",
          iconRight: this.formType == 'stepVertical' ? "fas fa-arrow-down" : "fas fa-arrow-right",
          label: this.$tr('ui.label.next'),
          ...(this.actions.next || {}),
          action: () => this.changeStep('next', isLastStep)
        },
        submit: {
          color: "green",
          icon: "fas fa-save",
          label: this.$tr('ui.label.save'),
          ...(this.actions.submit || {}),
          action: () => this.changeStep('next', isLastStep)
        },
      }

      //Validate if is last step
      let isLastStep = this.step == (this.blocksData.length - 1)

      //Instance Response
      let response = {previous: actions.previous, next: (isLastStep ? actions.submit : actions.next)}

      //Validate prop icon
      if (!response.previous.icon) delete response.previous.icon
      if (!response.next.icon) delete response.next.icon

      //Response
      return response
    },
    //Return all form fields
    blocksFieldsName() {
      //Defualt fields anme
      let fields = []
      //Get field name form every block
      this.blocksData.forEach(block => {
        Object.keys(block.fields).forEach(fieldKey => {
          fields.push(block.fields[fieldKey].name || fieldKey)
        })
      })
      //Response
      return fields
    }
  },
  methods: {
    //Init method
    async init() {
      this.success = false
      this.innerLoading = true
      await this.getFormFields()
      this.setLocaleFields()
      this.setLocaleFormData()
      this.listenerStepTabClick()
      this.innerLoading = false
      this.success = true
    },
    //Get form fields
    getFormFields() {
      return new Promise((resolve, reject) => {
        //Reset formBlocks
        this.formBlocks = false
        //Validate form data
        if (!this.formId) return resolve(false)
        //Request Params
        let requestParams = {
          refresh: true,
          params: {include: 'blocks.fields'}
        }

        //Request
        this.$crud.show('apiRoutes.qform.forms', this.formId, requestParams).then(response => {
          this.formBlocks = response.data
          resolve(response.data)
        }).catch(error => reject(error))
      })
    },
    //set locale form data
    setLocaleFormData() {
      let formData = this.$clone({...this.locale.form, ...this.value})

      //Clear fields
      /*Object.keys(formData).forEach(fieldName => {
        if (!this.settings.locales.includes(fieldName) && !this.blocksFieldsName.includes(fieldName))
          delete formData[fieldName]
      })*/

      //Validate data to fake fields
      this.blocksData.forEach(block => {
        //Parse fields
        let parsedFields = this.getParsedFields(block.fields)
        //Loop every fields
        for (var key in parsedFields) {
          //get field data
          let field = parsedFields[key]
          //Validate translatable field
          if (field.isTranslatable) {
            this.settings.locales.forEach(locale => {
              //validate if exist locale in form data
              if (formData[locale] == undefined) formData[locale] = {}

              //Validate translatable as fake field
              if (field.fakeFieldName) {
                //Validate fake field
                if ((formData[locale][field.fakeFieldName] == undefined) || (typeof formData[locale][field.fakeFieldName] != 'object'))
                  formData[locale][field.fakeFieldName] = {}
                //Validate field
                if (formData[locale][field.fakeFieldName][field.name || key] == undefined)
                  formData[locale][field.fakeFieldName][field.name || key] = field.value
              }
              //Validate translatable
              else if (formData[locale][field.name || key] == undefined) {
                formData[locale][field.name || key] = field.value
              }
            })
          } else {
            if (field.fakeFieldName) {
              //Validate fake field
              if ((formData[field.fakeFieldName] == undefined) || (typeof formData[field.fakeFieldName] != 'object'))
                formData[field.fakeFieldName] = {}
              //Validate field
              if (formData[field.fakeFieldName][field.name || key] == undefined)
                formData[field.fakeFieldName][field.name || key] = field.value
            }
            //Validate translatable
            else if (formData[field.name || key] == undefined)
              formData[field.name || key] = field.value
          }
        }
      })

      //set locale form data
      this.$set(this.locale, 'form', this.$clone(formData))
    },
    //Set form Fields from blocks
    setLocaleFields() {
      //Reset locale component
      if (this.$refs.localeComponent) this.$refs.localeComponent.vReset()

      //Instance variables to locale fields
      let fields = {}, fieldsTranslatables = {}

      //Loop every fields from all blocks
      this.blocksData.forEach(block => {
        //Parse fields
        let parsedFields = this.getParsedFields(block.fields)

        //Validate every fields
        for (var key in parsedFields) {
          let field = parsedFields[key]//get field data
          //Add to data locale to field
          if (field.isTranslatable) {
            if (field.fakeFieldName) {
              if (!fieldsTranslatables[field.fakeFieldName]) fieldsTranslatables[field.fakeFieldName] = {}
              fieldsTranslatables[field.fakeFieldName][field.name || key] = field.value
            } else fieldsTranslatables[field.name || key] = field.value
          } else {
            //Set fake field
            if (field.fakeFieldName) {
              if (!fields[field.fakeFieldName]) fields[field.fakeFieldName] = {}
              fields[field.fakeFieldName][field.name || key] = field.value
            } else {//Set field
              fields[field.name || key] = field.value
            }
          }
        }
      })

      //Assign fields and validations to locale
      this.$set(this.locale, 'fields', this.$clone(fields))
      this.$set(this.locale, 'fieldsTranslatable', this.$clone(fieldsTranslatables))
    },
    //return parsed fields
    getParsedFields(fields) {
      let response = {}//instance response

      //loop every fields
      Object.keys(fields).forEach(fieldKey => {
        let field = fields[fieldKey]//get field data
        let fieldName = (field.name || fieldKey)//instance field name

        //Validate field permission
        if (field.permission && !this.$auth.hasAccess(field.permission)) return

        //parse child fields
        if (field.children) {
          Object.keys(field.children).forEach(childFieldKey => {
            response[`${fieldName}-${childFieldKey}`] = {
              ...field.children[childFieldKey],
              fakeFieldName: fieldName,
              isTranslatable: field.isTranslatable,
              permission: field.permission
            }
          })
        } else {//Set to response
          response[fieldKey] = {
            ...field,
            ...((field.isFakeField && !field.fakeFieldName) ? {fakeFieldName: 'options'} : {})
          }
        }
      })

      //Parse every fields
      Object.keys(response).forEach(fieldName => {
        //Validate col class
        let colClass = (response[fieldName].colClass || response[fieldName].columns || this.defaultColClass)
        response[fieldName].colClass = colClass.split(' ').filter(item => item.includes('col-')).join(' ')
      })

      //response
      return response
    },
    //Listener to step head click
    listenerStepTabClick() {
      var stepTabs = document.getElementsByClassName('q-stepper__tab');
      let _this = this
      //Listen click on step tab
      for (var i = 0; i < stepTabs.length; i++) {
        (function (index) {
          stepTabs[index].addEventListener("click", function () {
            if (parseInt(index) != _this.step) _this.changeStep(index)
          })
        })(i);
      }
    },
    //Handler step transition
    async changeStep(toStep, isSubmit = false) {
      //Validate if new Step it's not same to current step
      let isValid = (toStep == 'previous') ? true : await this.$refs.formContent.validate()
      //Validate if new Step it's not same to current step
      if (isValid) {
        //Emit submit form
        if (isSubmit) {
          if (this.sendTo && this.sendTo.apiRoute) {
            this.innerLoading = true
            //Request Data
            let requestData = {...this.locale.form, ...(this.sendTo.extraData || {})}
            //Request
            this.$crud.create(this.sendTo.apiRoute, requestData).then(response => {
              this.innerLoading = false
              this.reset()
              this.$emit('sent', this.$clone(this.locale.form))
            }).catch(error => {
              this.innerLoading = false
            })
          } else {
            this.$emit('submit', this.$clone(this.locale.form))
          }
        } else {//Change step
          if (toStep == 'previous') this.$refs.stepper.previous()//To previous step
          else if (toStep == 'next') this.$refs.stepper.next()//To next step
          else if (this.allowNavigation) this.$refs.stepper.goTo(toStep)//To specific step
        }
      }
    },
    //Reset form
    reset() {
      this.componentId = this.$uid()
      this.$refs.formContent.resetValidation()
      this.step = 0
    },
  }
}
</script>

<style lang="stylus">
#dynamicFormComponentContent
  min-height 150px

  #stepperContent
    padding 0

    &.q-stepper--vertical
      .q-stepper__tab
        padding 12px 5px !important

      .q-stepper__step-inner
        padding 0 10px 10px 40px

    &.q-stepper--horizontal

      .q-stepper__step-inner
        padding 0

  .q-btn
    .q-icon
      font-size 14px
</style>
