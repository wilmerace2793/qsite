<template>
  <div class="step-summary">
    <div class="row justify-center align-center">
      <div class="col-12 col-sm-10 col-md-11">
        <div class="tw-p-4 md:tw-p-8 tw-mx-auto lg:tw-w-3/5">
          <div v-if="stepContent" class="tw-text-xs md:tw-text-base text-center tw-font-bold tw-pb-4" 
              v-html="stepContent.description"> 
          </div> 
          <div class="row q-col-gutter-md" v-if="selected">
            <div class="col-12 col-md-7 tw-mt-3">

              <div class="selected-label">Usuario</div>  
              <div class="selected-box ">
                {{selected.user.email}}
              </div> 
              <div class="selected-label">Organizacion</div>  
              <div class="selected-box">
                {{selected.organization}}
              </div> 

              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="selected-label">Categoria</div>  
                  <div class="selected-box">
                    {{selected.category.title}}
                  </div> 
                </div>
                <div class="col-12 col-md-6">
                  <div class="selected-label">Plan</div>  
                  <div class="selected-box">
                    {{selected.plan.product.name}} {{selected.plan.optionValue}}
                  </div> 
                </div>
              </div>

              <div class="selected-label">Plantilla</div>  
              <div class="selected-box">
                {{ selected.layout.name }}
                <div class="select-description" v-html="selected.layout.description"></div>
              </div> 

            </div>
            <div class="col-12 col-md-5">
              <q-img class="img-themes tw-h-44" contain
                      :src="selected.layout.mediaFiles.mainimage.extraLargeThumb"
              />
            </div>
          </div>
        
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { STEP_NAME_SUMMARY } from './model/constant.js';
export default {
  components: {},
  data() {
    return {
      selected: '',
      stepContent: ''
    }
  },
  props: {
    info: {
      type: Array,
      default: () => [],
    },
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
      this.getDataSelected();
    })
  },
  methods: {
    async getStepInfo() {
      this.stepContent = this.info.find((item) => item.systemName === STEP_NAME_SUMMARY);
    },
    async getDataSelected() {
      try {
        if(this.infoBase) {
            this.selected=this.infoBase;
            this.$emit("update", {active: true});
        } else {
          // Sino hay nada es porque recargo entonces verifico que tiene cache
          const info = await this.$cache.get.item('org-wizard-data');
          if(info != null) {
              this.selected=info;
              this.$emit("update", {active: true});
          } 
        }
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>
<style scope>
.page-full .q-stepper__content  {
  width: 100% !important;
  min-height: 100vh !important;
  display: contents;
  background: -webkit-linear-gradient(right, #fff, #e4e2f2);
  justify-content: center;
  align-items: center;
  padding-top: 5rem;
}
.page-full .q-stepper__nav  {
  width: 100% !important;
}
.page-full .img-themes {
  object-fit: contain;
  height: 50vh;
}
</style>