<template>
  <div id="dynamicFormComponent">
    <div id="dynamicFormComponentContent" class="relative-position" :key="componentId">
      <!--Top Content-->
      <div id="topContent">
        <!--Title-->
        <div class="box-title text-center q-mb-md" v-if="formProps.title" v-html="formProps.title"></div>
        <!--Description-->
        <div class="text-body2 q-mb-md text-grey-8" v-if="formProps.description" v-html="formProps.description"></div>
      </div>

      <!--Progress bar-->
      <div id="progressContent" class="q-mb-md">
        <q-linear-progress :value="progress" color="primary"/>
      </div>

      <!--Form Content-->
      <q-form autocorrect="off" autocomplete="off" ref="formContent" class="full-width"
              @validation-error="$alert.error($tr('ui.message.formInvalid'))">
        <!--Stepper content-->
        <q-stepper id="stepperContent" v-model="step" color="primary" animated ref="stepper" flat
                   :vertical="formType == 'stepVertical' ? true : false"
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
            <div class="row q-col-gutter-x-md">
              <dynamic-field v-for="(field, keyField) in block.fields" :key="keyField" :field="field"
                             v-model="formData[field.name || keyField]" :class="field.colClass || defaultColClass"/>
            </div>

            <!--Actions-->
            <div :class="`actions__content row justify-${step == 0 ? 'end' : 'between'}`">
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
    defaultColClass: {default: 'col-12 col-md-6'}
  },
  watch: {
    value: {
      deep: true,
      handler: function (newValue, oldValue) {
        this.setValueToFormData()
      }
    },
    formData: {
      deep: true,
      handler: function (newValue, oldValue) {
        this.$emit('input', this.$clone(this.formData))
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
      componentId: this.$uid(),
      step: 0,
      innerLoading: false,
      formBlocks: false,
      formData: {},
    }
  },
  computed: {
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
      if ((this.blocksData.length >= 2) && (this.formType == 'stepHorizontal'))
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
          icon: "fas fa-arrow-left",
          label: this.$tr('ui.label.previous'),
          ...(this.actions.previous || {}),
          vIf: (this.step == 0) ? false : true,
          action: () => this.changeStep('previous')
        },
        next: {
          color: "green",
          iconRight: "fas fa-arrow-right",
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
      this.innerLoading = true
      await this.getFormFields()
      this.setFormFields()
      this.setValueToFormData()
      this.listenerStepTabClick()
      this.innerLoading = false
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
    //Set form Fields from blocks
    setFormFields() {
      this.blocksData.forEach(block => {
        for (var fieldName in block.fields) {
          let field = block.fields[fieldName]
          this.$set(this.formData, (field.name || fieldName), field.value)
        }
      })
    },
    //Set value to formData
    setValueToFormData() {
      if (JSON.stringify(this.value) != JSON.stringify(this.formData)) {
        //Merge formData with Value
        let formData = this.$clone({...this.formData, ...this.value})
        //Clear fields
        Object.keys(formData).forEach(fieldName => {
          if (!this.blocksFieldsName.includes(fieldName)) delete formData[fieldName]
        })
        //Set formData
        this.formData = this.$clone(formData)
      }
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
    changeStep(toStep, isSubmit = false) {
      //Validate if new Step it's not same to current step
      this.$refs.formContent.validate().then(isValid => {
        if (isValid) {
          //Emit submit form
          if (isSubmit) {
            if (this.sendTo && this.sendTo.apiRoute) {
              this.innerLoading = true
              //Request Data
              let requestData = {...this.formData, ...(this.sendTo.extraData || {})}
              //Request
              this.$crud.create(this.sendTo.apiRoute, requestData).then(response => {
                this.innerLoading = false
                this.reset()
                this.$emit('sent', this.$clone(this.formData))
              }).catch(error => {
                this.innerLoading = false
              })
            } else {
              this.$emit('submit', this.$clone(this.formData))
            }
          } else {//Change step
            if (toStep == 'previous') this.$refs.stepper.previous()//To previous step
            else if (toStep == 'next') this.$refs.stepper.next()//To next step
            else if (this.allowNavigation) this.$refs.stepper.goTo(toStep)//To specific step
          }
        }
      })
    },
    //Reset form
    reset() {
      this.setFormFields()
      this.componentId = this.$uid()
      this.$refs.formContent.resetValidation()
      this.step = 0
    },
  }
}
</script>

<style lang="stylus">
#dynamicFormComponentContent
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
