<template>
  <div class="step-themes">
    <h2 class="step-title">Selecciona la plantilla que mas te gusta</h2>
    <p class="tw-text-sm tw-px-8 tw-text-center tw-mb-9">Despues de elegir tu plantilla, podras cambiar el color y el
      contenido de tu sitio siempre que lo desees</p>
    <div class="row">
      <div class="col-6 col-md-4 tw-mb-2 tw-p-3 tw-cursor-pointer" v-for="(item, index) in themes" @click="selected=item">
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
        <p class="tw-text-sm tw-mb-8">Despues de elegir tu plantilla, podras cambiar el color y el
      contenido de tu sitio siempre que lo desees</p>
          <img src="./images/composition.svg"/>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      selected: "",
      themes: [
        {name: 'uno', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {name: 'dos', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {name: 'tres', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {name: 'unod', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {name: 'dosd', image: 'http://imgfz.com/i/ckeaMRb.jpeg'},
        {name: 'tresd', image: 'http://imgfz.com/i/ckeaMRb.jpeg'}
      ]
    }
  },
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