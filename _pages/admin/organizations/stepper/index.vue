<template>
  <div class="page-stepper">
    <q-stepper
        v-model="step"
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
        <component :is="step.component" />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <div class="tw-px-4 tw-pt-4 tw-pb-1">
            <div class="row justify-between">
              <div class="col-4">
                <q-btn rounded no-caps v-if="step > 1"  icon="fas fa-arrow-left" color="primary" @click="$refs.stepper.previous();sliderMinus()" label="Anterior"
                       class="q-ml-sm"/>
              </div>
              <div class="col-4 text-right">
                <q-btn rounded no-caps @click="$refs.stepper.next();sliderPlus()" icon-right="fas fa-arrow-right"  color="primary" :label="step === 4 ? 'Pagar' : 'Continuar'"/>
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
      step: 1,
      slider: 0,
      steps: modelSteps
    }
  },
  methods: {
    sliderPlus(){
      this.slider = this.slider + 25;
    },
    sliderMinus(){
      this.slider = this.slider - 25;
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
  @apply tw-text-xl lg:tw-text-3xl tw-px-10 tw-text-center tw-pb-6 tw-font-bold;
}
.page-stepper .step-title-1 {
  @apply tw-text-xl lg:tw-text-2xl tw-px-10 tw-text-center tw-pb-6 tw-font-bold;
}
/*@-webkit-keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
            transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}
@keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
            transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}*/
</style>