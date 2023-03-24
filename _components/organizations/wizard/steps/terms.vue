<template>
  <div class="step-terms">
    <h2 class="step-title">{{stepContent.title}}</h2>
    <div class="tw-mx-auto tw-text-base tw-max-w-sm">
        <div class="tw-flex tw-overflow-hidden tw-mb-3">
            <q-checkbox dense v-model="buttonEmail" color="primary" />
            <div class="tw-pl-3 text-justify">
              Sí, quiero recibir correos electrónicos con consejos prácticos, novedades y ofertas especiales para mi página web.
            </div>
        </div>
        <div class="tw-flex tw-overflow-hidden tw-mb-3">
            <q-checkbox dense v-model="buttonTerms" color="primary" />
            <div class="tw-pl-3 text-justify">
                Se aplican las <a href="#" target="_blank" class="text-primary">Condiciones de uso</a> de Wygo. Se aplica la <a href="#" target="_blank" class="text-primary">Política de privacidad</a> de Wygo.
            </div>
        </div>
    </div>
    <div class="step-sidebar">
      <div class="terms-text tw-max-w-sm tw-w-full">
        <div class="tw-text-base tw-mb-8 text-center" v-html="stepContent.description"></div>
        <q-img v-if="stepContent.mediaFiles" contain
                :src="stepContent.mediaFiles.mainimage.extraLargeThumb"
                :ratio="1/1"
          />
      </div>
    </div>
  </div>
</template>
<script>
import storeStepWizard from './store/index.ts';
import { 
  STEP_NAME_TERMS,
  ID_CATE_ACTIVITIES } from './Model/constant.js';
export default {
  data() {
    return {
      buttonEmail: false,
      buttonTerms: false,
      /*stepContent: {
        title: 'Condiciones de uso',
        summary: 'Acepta nuestras Condiciones de uso para disfrutar de todas las bondades que tiene Wygo para ti',
        image: 'http://imgfz.com/i/5E7Qrbq.png',
      },*/
      stepContent: '',
    }
  },
  inject: {
    infoBase: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.$nextTick(async function () {
      this.getData();
      this.getStepInfo();
    })
  },
  watch: {
    buttonTerms(newTerms, oldTerms) {
      this.$emit("update",  { active: newTerms });
    }
  },
  methods: {
    getData(){
      this.buttonTerms = this.infoBase.terms;
    },
    async getStepInfo() {
      this.stepContent = await storeStepWizard().getInfoStep(ID_CATE_ACTIVITIES,STEP_NAME_TERMS);
    },
  }
}
</script>
<style>
.step-terms .terms-text {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-terms {
  @apply tw-flex tw-min-h-screen tw-flex-col tw-justify-center;
  margin-top: -95px;
}
</style>