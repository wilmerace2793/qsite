<template>
  <div class="step-themes">
    <h2 class="step-title">{{stepContent.title}}</h2>
    <p class="tw-text-sm tw-px-12 tw-text-center tw-mb-9">{{stepContent.summary}}</p>
    <div class="row">
      <div class="col-6 col-md-4 tw-mb-2 tw-p-3 tw-cursor-pointer" v-for="(item, index) in themes" @click="selectData(item)">
        <div class="item-theme" :class="{ activeClass : item.name === selected.name }">
          <q-img 
                 :src="item.image"
                 :ratio="1/1"
                 class="tw-rounded tw-border tw-w-full"
          >
            <!--<div class="item-theme-name absolute-bottom text-subtitle1 text-center">
              {{ item.name }}
            </div>-->
          </q-img>
        </div>
      </div>
    </div>
    <div class="step-sidebar" v-if="selected">
      <div class="select-card tw-max-w-md" >
        <!--<div class="tw-text-sm text-center tw-pb-3 tw-capitalize tw-font-semibold">{{ selected.name }}</div>-->
        <img :src="selected.image" style="height: 300px;"/>
      </div>
    </div>
    <div class="step-sidebar" v-else>
      <div class="select-card tw-max-w-md" >
          <img src="./images/composition.svg"/>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      stepContent: {
        title: 'Selecciona la plantilla que mas te gusta',
        summary: 'Despues de elegir tu plantilla, podras cambiar el color y el contenido de tu sitio siempre que lo desees',
        image: './images/composition.svg',
      },
      selected: "",
      themes: [
        {id: 1, name: 'uno', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {id: 2, name: 'dos', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {id: 3, name: 'tres', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {id: 4, name: 'unod', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {id: 5, name: 'dosd', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {id: 6, name: 'tresd', image: 'http://imgfz.com/i/ckeaMRb.jpeg'}
      ]
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.navNext()
    })
  },
  methods: {
    selectData(item) {
      this.selected=item;
      this.navNext();
    },
    navNext() {
      if(this.selected!==''){
        this.$emit("update", true, this.selected.id);
      }else {
        this.$emit("update", false);
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
  border-color: var(--q-color-primary);
}
.step-themes .step-sidebar-stretch {
  @apply tw-items-stretch !important;
} 
</style>