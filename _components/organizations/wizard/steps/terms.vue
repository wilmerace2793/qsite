<template>
  <div class="step-terms">
    <div class="step-loading" v-if="loading"><div></div><div></div></div>
    <div v-else>
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
    </div>
    <div class="step-sidebar">
      <div class="step-loading" v-if="loadingSidebar"><div></div><div></div></div>
      <div class="terms-text tw-max-w-sm tw-w-full" v-else>
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
import { STEP_NAME_TERMS } from './model/constant.js';
export default {
  props: {
    info: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      loadingSidebar: false,
      buttonEmail: false,
      buttonTerms: false,
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
      this.getStepInfo(); 
      this.getData();
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
      this.loadingSidebar = true;
      this.stepContent = await this.info.find((item) => item.systemName === STEP_NAME_TERMS);
      this.loadingSidebar = false;
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