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
      <img :src="logo" class="tw-h-10 tw-w-auto" /> 
      <q-slider class="slider-header" v-model="slider" thumb-path="" readonly :min="0" :max="100"/>
    </div>
    
    <!--  keep-alive  :class="{'page-register' : pace == STEP_REGISTER }" -->
    <div class="page-wizard tw-w-full tw-relative">
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
        <component :is="step.component" @update="navNext" />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation v-if="pace > 1">
          <div class="tw-px-4 tw-pt-4 tw-pb-1">
            <div class="row justify-between">
              <div class="col-4">
                <q-btn rounded no-caps v-if="pace > 2"  icon="fas fa-arrow-left" color="primary" @click="stepperPrevious()" label="Anterior"
                       class="q-ml-sm"/>
              </div>
              <div class="col-4 text-right">
                <q-btn :disabled="!isActive" rounded no-caps @click="stepperNext()" icon-right="fas fa-arrow-right"  color="primary" :label="pace === steps.length ? 'Finalizar' : 'Continuar'"/>
              </div>
            </div>
          </div>
          <!--<q-slider v-model="slider" thumb-path="" readonly :min="0" :max="100"/>-->
        </q-stepper-navigation>
      </template>

    </q-stepper>
    </div>
  </div>
</template>
<script>
import modelSteps from '@imagina/qsite/_components/organizations/wizard/steps/Model/steps.js';
import  { 
  STEP_REGISTER,
  STEP_TERMS,
  STEP_COMPANY,
  STEP_CATEGORIES,
  STEP_THEMES,
  STEP_PLANS
} from '@imagina/qsite/_components/organizations/wizard/steps/Model/constant.js';

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
      //this.getData()
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
    init() {
      //this.getData()
      this.sliderPercent = 100/this.steps.length;
      this.slider = this.sliderPercent;
    },
    stepperPrevious(){
      this.$refs.stepper.previous();
      this.slider = this.slider - this.sliderPercent;
      this.verifyStep();
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
            console.log(this.dataCheck);

            this.messageEnd();

          }
        }
        this.$refs.stepper.next();

      } catch (error) {
        console.log(error);
      }
    },
    navNext(value) {
      try {
        // ubico el step actual para activar el boton next dependiento del emit
        const current = this.steps.find((item) => item.id === this.pace);
        current.done=value.active;
        this.isActive = current.done;

        // si es registro normal continua 
        if(current.id==STEP_REGISTER){
          this.stepperNext();
        }

        // si es terminos y condiciones el valor del check actualiza la data
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
    },
    messageEnd(){
      this.$q
        .dialog({
          ok: "Continuar",
          title: "Registro Exitoso",
          message: "A partir de ahora puedes disfrutar de los servicios que wygo",
          cancel: false,
          persistent: true,
        })
        .onOk(async () => {
      
        });
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

.page-wizard .q-stepper__header {
  @apply tw-hidden;
}
.page-wizard .q-stepper {
  @apply tw-rounded-none tw-shadow-none;
}
.page-wizard .q-stepper__content {
  @apply tw-min-h-screen tw-z-10 tw-flex tw-flex-col tw-bg-white tw-box-border tw-w-2/4;
  padding: 95px 0 75px;
  transition: transform .4s ease-out, width .4s ease-out;
}
.page-wizard .q-stepper__nav {
  @apply tw-w-2/4 tw-z-10 tw-left-0 tw-bottom-0 tw-fixed tw-bg-white tw-border-t-2;
  @apply tw-border-gray-300 tw-border-opacity-50;
  transition: transform .4s ease-out, width .4s ease-out;
  padding-bottom: 15px;
}
.page-wizard .q-stepper__nav .q-btn .q-icon {
  @apply tw-text-sm;
}
.page-wizard .q-stepper--horizontal .q-stepper__step-inner {
  padding: 0 15px;
}
.page-wizard .step-sidebar {
  @apply tw-py-20 tw-flex tw-justify-center tw-items-center tw-flex-col;
  @apply tw-h-full tw-left-1/2 tw-right-0 tw-top-0 tw-fixed;
  contain: strict;
  padding: 90px 20px 20px;
  transition: left .4s ease-out, width .4s ease-out;
  background: -webkit-linear-gradient(right,#fff,#e4e2f2);
}
@media only screen and (max-width: 1439px) {
  .page-wizard .q-stepper__content,
  .page-wizard .q-stepper__nav {
    /*width: 700px;*/
    width: 50%;
  }
  .page-wizard .step-sidebar {
    @apply tw-left-auto;
    /*width: calc(100% - 700px);*/
    width: 50%;
  }
}
@media only screen and (max-width: 1023px) {
  .page-wizard .q-stepper__content {
    @apply tw-w-full tw-pb-24;
  }
  .page-wizard .step-sidebar {
    @apply tw-w-0 tw-p-0;
  }
  .page-wizard .q-stepper__nav {
    @apply tw-w-full;
  }
}
.page-wizard .q-slider__track-container--h {
  @apply tw-p-0;
}
.page-wizard .step-title {
  @apply tw-text-xl lg:tw-text-3xl tw-px-12 tw-text-center tw-pb-8 tw-font-bold;
}
.page-wizard .step-title-1 {
  @apply tw-text-xl lg:tw-text-2xl tw-px-10 tw-text-center tw-pb-6 tw-font-bold;
}
.page-register .q-stepper__content {
  padding: 90px 20px 20px;
  transition: left .4s ease-out, width .4s ease-out;
  background: -webkit-linear-gradient(right,#fff,#e4e2f2);
  width: 100% !important;
}

.slider-header {
  @apply tw-absolute;
  bottom: -14px;
}

.q-dialog__message {
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
</style>
