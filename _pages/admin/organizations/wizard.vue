<template>
  <div id="wizardOrganization" class="tw-h-screen tw-overflow-auto">
    <div class="page-header
                tw-border-b-2 tw-border-white tw-border-opacity-50
                tw-fixed
                tw-top-0
                tw-left-0
                tw-z-20
                tw-flex tw-justify-center tw-items-center
                tw-w-full
                tw-h-16
    ">
      <a :href="urlBase" target="_blank"> <img :src="logo" class="tw-h-10 tw-w-auto" /> </a>
      <q-slider class="slider-header" v-model="slider" thumb-path="" readonly :min="0" :max="100"/>
    </div>

    <div class="step-loading"><div></div><div></div></div>
    <!-- keep-alive -->
    <div class="page-wizard tw-w-full tw-relative">
      <q-stepper
        v-model="pace"
        ref="stepper"
        v-if="dataText.length>0"
      >
      <q-step
        v-for="step in steps"
        :key="step.id"
        :name="step.id" 
        :prefix="step.prefix"
        :title="step.title"
        :done="step.done"
        >
        <component :is="step.component" @update="navNext" :info.async="dataText"/>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation v-if="pace > 1">
          <div class="tw-pt-3 md:tw-pt-4 tw-pb-1">
            <div class="row justify-between">
              <div class="col-4">
                <q-btn  rounded 
                        no-caps 
                        v-if="pace > 2"  
                        color="primary" 
                        icon="fas fa-arrow-left tw-mr-0 sm:tw-mr-2"
                        @click="stepperPrevious()">
                  <div class="tw-hidden sm:tw-inline-block">
                    Anterior
                  </div>      
                </q-btn>
              </div>
              <div class="col-4 text-right">
                <q-btn  :disabled="!isActive" 
                        rounded 
                        no-caps 
                        icon-right="fas fa-arrow-right tw-ml-0 sm:tw-ml-2"
                        @click="stepperNext(pace)" 
                        color="primary">
                  <div class="tw-hidden sm:tw-inline-block">
                    {{ pace === steps.length ? 'Finalizar' : 'Continuar' }}
                  </div>       
                </q-btn>        
              </div>
            </div>
          </div>
        </q-stepper-navigation>
      </template>

    </q-stepper>
    </div>
  </div>
</template>
<script>
import modelSteps from '@imagina/qsite/_components/organizations/wizard/steps/model/steps.js';
import storeStepWizard from '@imagina/qsite/_components/organizations/wizard/steps/store/index.ts';
import  { 
  STEP_REGISTER,
  STEP_TERMS,
  STEP_COMPANY,
  STEP_CATEGORIES,
  STEP_THEMES,
  STEP_PLANS,
  ID_CATE_ACTIVITIES,
  PLAN_BASE_ID
} from '@imagina/qsite/_components/organizations/wizard/steps/model/constant.js';

const infoMappings = {
  [STEP_COMPANY]: 'organization',
  [STEP_CATEGORIES]: 'category',
  [STEP_THEMES]: 'layout',
  [STEP_PLANS]: 'plan'
};

export default {
  beforeDestroy() {
  },
  props: {},
  components: {},
  watch: {},
  computed: {},
  data() {
    return {
      loading: false,
      data: [],
      logo: this.$store.state.qsiteApp.logo,
      pace: null,
      slider: 0,
      steps: modelSteps,
      sliderPercent:0,
      isActive: false,
      urlBase: this.$store.state.qsiteApp.baseUrl,
      dataText: [],
      dataCheck: {
        user: null,
        terms: false,
        category: null,
        layout: null,
        plan: null,
        organization: '',
      },
    }
  },
  provide() {
    return {
      infoBase: this.dataCheck
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.init();
    })
  },
  methods: {
    init() {
      /*this.$cache.remove('org-wizard-step');
      this.$cache.remove('org-wizard-categories');
      this.$cache.remove('org-wizard-plans');
      this.$cache.remove('org-wizard-data');*/
      this.getInfo();
      this.configSlider();
    },
    configSlider(){
      this.sliderPercent = 100/this.steps.length;
      this.slider = this.sliderPercent;
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Requets params
        let requestParams = {
          refresh: refresh
        }
        //Request
        this.$crud.index('apiRoutes', requestParams).then(response => {
          this.data = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    stepperPrevious(){
      this.verifyStep();
      this.slider = this.slider - this.sliderPercent;
      this.$refs.stepper.previous();
    },
    async stepperNext(step){
      try {
        this.slider = this.slider + this.sliderPercent;
        this.setCacheInfo(this.dataCheck);
        // si llega al final y todo esta lleno envia la info
        if (this.pace === this.steps.length) {
          if((this.dataCheck.user!== null) && 
            this.dataCheck.terms && 
            (this.dataCheck.category!== null) && 
            (this.dataCheck.layout!== null) && 
            (this.dataCheck.plan!== null) && 
            (this.dataCheck.organization!== '')) {

              const url = `${this.dataCheck.plan.planUrl}?billingcycle=${this.dataCheck.plan.optionValue.toLowerCase()}&layoutId=${this.dataCheck.layout.id}&organizationName=${this.dataCheck.organization}&categoryId=${this.dataCheck.category.id}&email=${this.dataCheck.user.email}`;
              //Clear cache
              this.$cache.remove('org-wizard-step');
              this.$cache.remove('org-wizard-categories');
              this.$cache.remove('org-wizard-plans');
              this.$cache.remove('org-wizard-data');
              // enviar a url de pago
              this.redirectAfterWizard(url);

          }
        } 

        this.$refs.stepper.next();
        this.setCacheStep(step+1);


      } catch (error) {
        console.log(error);
      }
    },
    async navNext(value) {
      try {
        // locate the current step to activate the next button depending on the emit
        const current = this.steps.find((item) => item.id === this.pace);
        current.done=value.active;
        this.isActive = current.done;

        if(current.id==STEP_REGISTER){
          this.dataCheck.user = value.info;
          this.stepperNext(current.id);
        }

        // if it is terms and conditions the value of the check updates the data
        if(current.id==STEP_TERMS){
          this.dataCheck.terms = value.active;
        }

        if (value.info!==undefined) {
          const mappedProp = infoMappings[current.id];
          if (mappedProp) {
            this.dataCheck[mappedProp] = value.info;
          }
        }

      } catch (error) {
        console.log(error);
      }
    },
    verifyStep(){
      const current = this.steps.find((item) => item.id === this.pace);
      this.isActive = current.done;
      this.setCacheStep(current.id-1);
    },
    redirectAfterWizard(url){
      this.$helper.openExternalURL(url, false)
    },
    async getInfo() {
      this.dataText = await storeStepWizard().getInfoWizard(ID_CATE_ACTIVITIES);
      // busco la info
      const categories = await storeStepWizard().getCategories();
      const plans = await storeStepWizard().getPlans(PLAN_BASE_ID);
      // se guarda en cache
      await this.$cache.set('org-wizard-categories',  categories );
      await this.$cache.set('org-wizard-plans',  plans );

      // verifico en que step se quedo antes de recargar
      const step = await this.$cache.get.item('org-wizard-step');
      // verifico que info tenia guardada antes de recargar
      const info = await this.$cache.get.item('org-wizard-data');
      console.log('getInfo',info);

      if(step) {        
        this.pace = step;
      } else {
        // importante sino hay data entonces si asignarle el valor
        this.pace = 1;
      }

      if(info != null) {     
        this.dataCheck = info;
      } 
      
    },
    async setCacheStep(step){
      await this.$cache.set('org-wizard-step',  step );
    },
    async setCacheInfo(data){
      await this.$cache.set('org-wizard-data',  data );
    }
  }
}
</script>
<style>
#wizardOrganization {
  -webkit-overflow-scrolling: touch;
  -webkit-font-smoothing: antialiased;
}
#wizardOrganization .page-header {
  @apply tw-bg-white;
  transition: all .4s ease-out;
  box-shadow: 0 0 6px -2px #8d8d8d;
}
#wizardOrganization .page-wizard .q-stepper__header {
  @apply tw-hidden;
}
#wizardOrganization .page-wizard .q-stepper {
  @apply tw-rounded-none tw-shadow-none;
}
#wizardOrganization .page-wizard .q-stepper__content {
  @apply tw-min-h-screen tw-z-10 tw-flex tw-flex-col tw-bg-white tw-box-border tw-w-2/4;
  padding: 95px 0 75px;
  transition: transform .4s ease-out, width .4s ease-out;
}
#wizardOrganization .page-wizard .q-stepper__nav {
  @apply tw-w-2/4 tw-z-10 tw-left-0 tw-bottom-0 tw-fixed tw-bg-white tw-border-t-2;
  @apply tw-border-gray-300 tw-border-opacity-50 tw-pb-3 md:tw-pb-4;
  transition: transform .4s ease-out, width .4s ease-out;
  /*padding-bottom: 15px;*/
}
#wizardOrganization .page-wizard .q-stepper__nav .q-btn .q-icon {
  @apply tw-text-sm;
}
#wizardOrganization .page-wizard .q-stepper--horizontal .q-stepper__step-inner {
  padding: 0 15px;
}
#wizardOrganization .page-wizard .step-sidebar {
  @apply tw-py-20 tw-flex tw-justify-center tw-items-center tw-flex-col;
  @apply tw-h-full tw-left-1/2 tw-right-0 tw-top-0 tw-fixed;
  contain: strict;
  padding: 90px 20px 20px;
  transition: left .4s ease-out, width .4s ease-out;
  background: -webkit-linear-gradient(right,#fff,#e4e2f2);
}
@media only screen and (max-width: 1439px) {
  #wizardOrganization .page-wizard .q-stepper__content,
  #wizardOrganization .page-wizard .q-stepper__nav {
    /*width: 700px;*/
    width: 50%;
  }
  #wizardOrganization .page-wizard .step-sidebar {
    @apply tw-left-auto;
    /*width: calc(100% - 700px);*/
    width: 50%;
  }
}
@media only screen and (max-width: 1023px) {
  #wizardOrganization .page-wizard .q-stepper__content {
    @apply tw-w-full tw-pb-24;
  }
  #wizardOrganization .page-wizard .step-sidebar {
    @apply tw-w-0 tw-p-0;
  }
  #wizardOrganization .page-wizard .q-stepper__nav {
    @apply tw-w-full;
  }
}
#wizardOrganization .page-wizard .q-slider__track-container--h {
  @apply tw-p-0;
}
#wizardOrganization .page-wizard .step-title {
  @apply tw-text-xl lg:tw-text-3xl tw-px-4 md:tw-px-12 tw-text-center tw-pb-4 lg:tw-pb-8 tw-font-bold;
}
#wizardOrganization .page-wizard .step-title-1 {
  @apply tw-text-xl lg:tw-text-2xl tw-px-10 tw-text-center tw-pb-6 tw-font-bold;
}
.page-register .q-stepper__content {
  padding: 90px 20px 20px;
  transition: left .4s ease-out, width .4s ease-out;
  background: -webkit-linear-gradient(right,#fff,#e4e2f2);
  width: 100% !important;
}
#wizardOrganization .slider-header {
  @apply tw-absolute;
  bottom: -14px;
}
#wizardOrganization .q-dialog__message {
  @apply tw-text-base;
}
@-webkit-keyframes fade-in-left {
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
}

#wizardOrganization .step-loading {
  @apply tw-absolute tw-w-20 tw-h-20 tw-top-1/2 tw-left-1/2;
  transform: translate(-50%, -50%);
}
#wizardOrganization .step-loading div {
  @apply tw-absolute tw-opacity-100 tw-rounded-full;
  border: 4px solid var(--q-color-primary);
  animation: step-loading 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
#wizardOrganization .step-loading div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes step-loading {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
