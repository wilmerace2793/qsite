<template>
  <!---Form content-->
  <div id="formContent">
    <div id="formComponentContent" class="relative-position">
      <!--Progress form-->
      <div id="progressContent" class="q-mb-md">
        <div class="text-primary text-center q-ma-none">
          <h4>{{metaTitle}}</h4>
        </div>
        <div class="col-12 text-caption text-grey-7 text-center" style="line-height: 1">
          <br>
          {{metaDescription}}
          <br>
        </div>
        <q-linear-progress :value="progress" color="blue-9" class="q-mt-lg"/>
      </div>

      <!--Form-->
      <q-form autocorrect="off" autocomplete="off" ref="formContent" class="full-width"
              @submit="toogleStep" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
        <q-stepper v-model="step" color="primary" animated ref="block"
                   @before-transition="handlerBeforeStepTransition"
                   :vertical="formType == 'stepVertical' ? true : false" header-nav animated>
          <q-step :name="`${keyBlock}`" title="" v-for="(block, keyBlock) in blocks"
                  :key="keyBlock" :title="block.title">
            <!--Title + Description-->
            <div id="header_content" class="q-mb-sm" v-if="formType == 'stepVertical' ? false : true ">
              <div class="step-text" v-if="block.title">{{block.title}}{{`${keyBlock}`}}</div>
              <div class="col-12 text-caption text-grey-7 text-center" style="line-height: 1" v-if="block.description">
                <br>{{block.description}}<br>
              </div>
              <br>
              <q-separator/>
              <br>
            </div>

            <!--Fields-->
            <div class="row q-col-gutter-x-md">
              <dynamic-field v-for="(field, keyField) in block.fields" :key="keyField" :field="field"
                             v-model="form[field.name || keyField]" :class="field.colClass || 'col-12 col-md-6'"/>
            </div>

            <!--Buttons Actions-->
            <div v-if="step != totalStep">
              <!--Previous action-->
              <q-btn v-if="step != 0" color="blue-9" unelevated label="Previous" rounded icon="fas fa-arrow-left"
                     v-bind="formActions.previous"
                     @click="wayStepper = 'before'; $refs.formContent.submit()" class="no-shadow" no-caps/>
              <!--Next action-->
              <q-btn color="blue-9" unelevated rounded no-caps :loading="loading"
                     v-bind="formActions.next" class="float-right"
                     @click="wayStepper = 'next'; $refs.formContent.submit()"/>
            </div>
          </q-step>
        </q-stepper>
      </q-form>

      <!--Innerloading-->
      <inner-loading :visible="loading"/>
    </div>
    <!-- Start Accordion Mode -->
    <!-- <div class="q-pa-md">
       <q-form autocorrect="off" autocomplete="off" ref="formAd" class="col-12 col-lg-8 offset-lg-2"
               @validation-error="$alert.error($tr('ui.message.formInvalid'))">
         <q-expansion-item :name="`${keyBlock}`" icon="fas fa-map-marker-alt" v-for="(block, keyBlock) in blocks"
                           :key="keyBlock"
                           :label="`${block.title}${keyBlock}`"
                           class="box-collapse q-mb-md"
                           header-class="header-container" group="fromAdExpansion">
           <div class="q-pa-md">
             <dynamic-field v-for="(field, keyField) in block.fields" :key="keyField" :field="field"
                            v-model="form[field.name || keyField]" :class="field.colClass || 'col-12 col-md-6'"/>
           </div>
         </q-expansion-item>
       </q-form>
     </div>-->
    <!-- End Accordion Mode -->
  </div>
</template>

<script>
    export default {
        props: {
            formType: {type: String, default: 'stepVertical'},
            metaInfoT: {
                type: String,
                required: true,
                default: 'Default Title'
            },
            metaInfoD: {
                type: String,
                required: true,
                default: 'Default Description'
            },
            blocks: {type: Array, default: false}
        },
        mounted() {
            this.totalStep = this.blocks.length;
        },
        data() {
            return {
                loading: false,
                step: `0`,
                form: {},
                userData: {},
                wayStepper: 'next',
                totalStep: 0,
            }
        },
        computed: {
            //Wizard Info
            metaTitle() {
                return this.metaInfoT;
            },
            metaDescription() {
                return this.metaInfoD;
            },
            //Form progress
            progress() {
                if (this.step == 0) return 0.2
                if (this.step != `${this.totalStep - 1}` && this.step != 0) return parseFloat(0.5 + this.step)
                if (this.step == `${this.totalStep - 1}`) return 1
            },
            //Form actions
            formActions() {
                return {
                    previous: {
                        vIf: this.step == 0 ? false : true
                    },
                    next: {
                        label: this.step == `${this.blocks.length - 1}` ? this.$tr('ui.label.save')
                            : this.$tr('ui.label.next'),
                        icon: this.step == `${this.blocks.length - 1}` ? 'fas fa-save' : 'fas fa-arrow-right',
                    }
                }
            },
        },
        methods: {
            //Toogle form step
            toogleStep() {
                console.warn(this.form)
                // this.$emit('submit', this.$clone(this.form))
                //If to toggle steps
                if (this.wayStepper == 'next')
                    if (this.step == `${this.totalStep - 1}`)
                        this.createItem(),
                            this.$emit('submit', this.$clone(this.form))
                    else
                        this.$refs.block.next()
                else
                    this.$refs.block.previous()
            },
            //Create lead on sale force
            createItem() {
                this.$emit('submit', this.$clone(this.form))
                alert("");
            },
            //Handler to before step transition
            async handlerBeforeStepTransition(newStep, oldStep) {
                let formValidated = await this.$refs.formContent.validate()
                if (!formValidated) {
                    this.$refs.block.goTo(oldStep)
                }
                console.warn('New: ', newStep, 'Old', oldStep, '----', formValidated)
            },
            //Reset form
            resetInput() {
                this.form = {};
                this.$refs.formContent.reset()
            },
        }
    }
</script>

<style lang="stylus">
  #progressContent
    padding: 0px 30px

    .q-ma-none
      margin -20px 0px


  .q-stepper__header
    display none !important

  #header_content
    .step-text
      color $grey-8
      text-align center
      font-size 28px
      font-weight bold

    .q-stepper__step-inner
      padding 0px 0

  .q-stepper
    box-shadow none
</style>
