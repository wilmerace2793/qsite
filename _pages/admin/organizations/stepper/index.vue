<template>
  <div class="page-stepper">
    <q-stepper
        v-model="pace"
        ref="stepper"
    >
     
      <q-step
        v-for="step in steps"
        :key="step.id"
        :name="step.id" 
        :prefix="step.prefix"
        :title="step.title"
        :done="step.done"
        >
        <component :is="step.component" @update="navNext"/>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <div class="tw-px-4 tw-pt-4 tw-pb-1">
            <div class="row justify-between">
              <div class="col-4">
                <q-btn rounded no-caps v-if="pace > 1"  icon="fas fa-arrow-left" color="primary" @click="stepperPrevious()" label="Anterior"
                       class="q-ml-sm"/>
              </div>
              <div class="col-4 text-right">
                <q-btn :disabled="!isActive" rounded no-caps @click="stepperNext()" icon-right="fas fa-arrow-right"  color="primary" :label="pace === steps.length ? 'Finalizar' : 'Continuar'"/>
              </div>
            </div>
          </div>
          <q-slider v-model="slider" thumb-path="" readonly :min="0" :max="100"/>
        </q-stepper-navigation>
      </template>

    </q-stepper>
  </div>
</template>
<script>
import modelSteps from './steps/Model/steps.js';

export default {
  components: {},
  data() {
    return {
      pace: 1,
      slider: 0,
      steps: modelSteps,
      sliderPercent:0,
      isActive: false,
      dataCheck: {
        terms: false,
        category: null,
        layout: null,
        plan: null,
        organization: '',
      }
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.init()
    })
  },
  methods: {
    init() {
      //this.getData()
      this.sliderPercent = 100/this.steps.length;
      this.slider = this.sliderPercent;
    },
    stepperPrevious(){
      this.$refs.stepper.previous();
      this.slider = this.slider - this.sliderPercent;
    },
    async stepperNext(){
      try {
        this.slider = this.slider + this.sliderPercent;
        
        // si llega al final y todo esta lleno envia la info
        if (this.pace === this.steps.length) {
          if(this.dataCheck.terms && 
            (this.dataCheck.category!== null) && 
            (this.dataCheck.layout!== null) && 
            (this.dataCheck.plan!== null) && 
            (this.dataCheck.organization!== '')) {
            console.log('enviar los datos');
          }
        }
        console.log(this.dataCheck); 
        this.$refs.stepper.next();

      } catch (error) {
        console.log(error);
      }
    },
    navNext(value, info) {
      // ubico el step actual para activar el boton next dependiento del emit
      const current = this.steps.find((item) => item.id === this.pace);
      current.done=value;
      this.isActive = current.done;

      // si es terminos y condiciones el valor del check actualiza la data
      if(current.id==1){
        this.dataCheck.terms = value;
      }

      // si es un step distinto a terminos y condiciones lo evalua y guarda la info
      if (info!==undefined){
        if(current.id==2){ // company
          this.dataCheck.organization = info;
        }
        if(current.id==3){ // Category
          this.dataCheck.category = info;
        }
        if(current.id==4){ // Layout
          this.dataCheck.layout = info;
        }
        if(current.id==5){ // plan
          this.dataCheck.plan = info;
        }
      }
    },
  }
}
</script>
<style>
.page-stepper .q-stepper__header {
  @apply tw-hidden;
}
.page-stepper .q-stepper {
  @apply tw-rounded-none tw-shadow-none;
}
.page-stepper .q-stepper__content {
  @apply tw-min-h-screen tw-z-10 tw-flex tw-flex-col tw-bg-white tw-box-border tw-w-2/4;
  padding: 95px 0 75px;
  transition: transform .4s ease-out, width .4s ease-out;
}
.page-stepper .q-stepper__nav {
  @apply tw-w-2/4 tw-z-10 tw-left-0 tw-bottom-0 tw-fixed tw-bg-white tw-border-t-2;
  @apply tw-border-gray-300 tw-border-opacity-50;
  @apply tw-p-0 !important;
  /*padding: 0 !important;*/
  transition: transform .4s ease-out, width .4s ease-out;
  margin-bottom: -5px;
}
.page-stepper .q-stepper__nav .q-btn .q-icon {
  @apply tw-text-sm;
}
.page-stepper .q-stepper--horizontal .q-stepper__step-inner {
  padding: 0 15px;
}
.page-stepper .step-sidebar {
  @apply tw-py-20 tw-flex tw-justify-center tw-items-center tw-flex-col;
  @apply tw-h-full tw-left-1/2 tw-right-0 tw-top-0 tw-fixed;
  contain: strict;
  padding: 90px 20px 20px;
  transition: left .4s ease-out, width .4s ease-out;
  background: -webkit-linear-gradient(right,#fff,#e4e2f2);
}
@media only screen and (max-width: 1439px) {
  .page-stepper .q-stepper__content,
  .page-stepper .q-stepper__nav {
    width: 700px;
  }
  .page-stepper .step-sidebar {
    @apply tw-left-auto;
    width: calc(100% - 700px);
  }
}
@media only screen and (max-width: 1023px) {
  .page-stepper .q-stepper__content {
    @apply tw-w-full tw-pb-24;
  }
  .page-stepper .step-sidebar {
    @apply tw-w-0 tw-p-0;
  }
  .page-stepper .q-stepper__nav {
    @apply tw-w-full;
  }
}
.page-stepper .q-slider__track-container--h {
  @apply tw-p-0;
}
.page-stepper .step-title {
  @apply tw-text-xl lg:tw-text-3xl tw-px-12 tw-text-center tw-pb-8 tw-font-bold;
}
.page-stepper .step-title-1 {
  @apply tw-text-xl lg:tw-text-2xl tw-px-10 tw-text-center tw-pb-6 tw-font-bold;
}
</style>