<template>
  <div class="step-themes">
    <h2 class="step-title">{{stepContent.title}}</h2>
    <div class="row tw-justify-center tw-px-4 tw-mb-6">
      <div class="col-6 col-md-4 tw-mb-2 tw-p-3 tw-cursor-pointer" 
          v-for="(item, index) in themes" v-if="themes.length>0">
        <div class="item-theme" 
            :class="{ activeClass : item.id === selected.id }"
            @click="selectData(item)">
          <q-img 
                 :src="item.mediaFiles.mainimage.smallThumb"
                 :ratio="1/1"
                 class="tw-rounded tw-border tw-w-full"
          >
          </q-img>
        </div>
      </div>
      <div class="col-12 tw-text-base" v-else>
        No hay plantillas relacionadas a este plan
      </div>

    </div>
    <div class="step-sidebar" >
      <div class="select-card tw-max-w-md" v-if="selected">
        <img class="img-themes" :src="selected.mediaFiles.mainimage.extraLargeThumb"  />
      </div>
      <div class="select-card tw-max-w-md" v-else>
        <p class="tw-text-base tw-mb-8 text-center">{{stepContent.summary}}</p>
        <img :src="stepContent.image" />
      </div>
    </div>
  </div>
</template>
<script>
import { CATEGORY_ECOMMERCE_ID } from './Model/constant.js';
export default {
  data() {
    return {
      loading: false,
      stepContent: {
        title: 'Elige la plantilla ideal para satisfacer tus necesidades',
        summary: 'Despues de elegir tu plantilla, podras cambiar el color y el contenido de tu sitio siempre que lo desees',
        image: 'http://imgfz.com/i/ku9vSNs.png',
      },
      selected: "",
      themes: [],
    }
  },
  inject:['infoBase'],
  mounted() {
    this.$nextTick(async function () {
      this.navNext();
      this.getData();
    })
  },
  methods: {
    selectData(item) {
      this.selected=item;
      console.log(item);
      this.navNext();
    },
    navNext() {
      if(this.selected!==''){
        this.$emit("update", { active: true, info: this.selected });
      }else {
        this.$emit("update", { active: false});
      }
    },
    async getData() {
      try {
       if(this.infoBase.plan.planRelatedProducts.length>0) {
          let themes = this.infoBase.plan.planRelatedProducts;
          this.themes = themes;
          if (this.infoBase.layout) {
            const found = themes.find(item => item.id == this.infoBase.layout.id);
            if(found){
              this.selected=this.infoBase.layout;
            } 
            this.navNext();
          }
       }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
<style>
.step-themes .select-card {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-themes .item-theme  {
  @apply tw-relative;
  transition: all .1s;
}
.step-themes .item-theme-name {
  @apply tw-p-1;
} 
.step-themes  .activeClass .item-theme-name {
  background-color: var(--q-color-primary);
} 
.step-themes .activeClass .tw-border {
  @apply tw-shadow-lg;
}
.step-themes .item-theme:after {
  @apply tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent tw-rounded;
  transition: border-color .2s,top .2s,right .2s,bottom .2s,left .2s;
  content: "";
}
.step-themes .activeClass:after, .step-themes .item-theme:hover:after {
  @apply tw--top-1.5 tw--right-1.5 tw--bottom-1.5 tw--left-1.5;
  background-color: var(--q-color-primary); z-index:-1;
}
.step-themes .step-sidebar-stretch {
  @apply tw-items-stretch !important;
} 
.step-themes .img-themes {
  object-fit: contain;
  height: 80vh;
}
</style>