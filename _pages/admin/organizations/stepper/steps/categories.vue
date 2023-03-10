<template>
  <div class="step-categories">
    <h2 class="step-title">¿Cuál es la temática de tu página web?</h2>

    <div class="tw-px-6 tw-pb-6 tw-mt-4">
      <dynamic-field :field="formFields.category" />
    </div>

    <div class="tw-px-6 row">
      <div class="col-6 col-md-4 tw-mb-2 tw-p-3 tw-cursor-pointer" v-for="(item, index) in categories" @click="selected=item">
        <div class="item-category" :class="{ activeClass : item.name === selected.name }">
          <q-img 
                 :src="item.image"
                 :ratio="4/3"
                 class="tw-rounded tw-w-full"
          >
            <div class="item-category-name absolute-bottom text-subtitle1 text-center">
              {{item.name}}
            </div>
          </q-img>
        </div>
      </div>

    </div>

    <div class="step-sidebar">
      <div class="select-category tw-max-w-md" v-if="selected">
          <div class="text-center tw-text-lg tw-font-bold tw-mb-3">  {{ selected.name }} </div>
          <div class="text-center tw-text-md" v-html="selected.description"></div>  
      </div>
      <div class="categories-text tw-max-w-sm" v-else>
        <p class="tw-text-sm tw-mb-8">Con la seleccion de la categoria conoceremos la temática de tu sitio web, y podremos proporcionarte las plantillas con los
        textos y la estructura que más se adapten a tu proyecto o negocio.</p>
          <img src="./images/select_option.svg"/>
      </div>
    </div>

  </div>
</template>
<script>

export default {
  data() {
    return {
      selected:"",
      categories: [
        { name:'Tienda', image: 'http://imgfz.com/i/z2Er0Rq.jpeg', description: 'Descripcion de la Categoria Tienda'},
        { name:'Arquitectura', image: 'http://imgfz.com/i/G9N74Sv.jpeg', description: 'Descripcion de la Categoria Arquitectura'},
        { name:'Viajes', image: 'http://imgfz.com/i/UpxX59i.jpeg', description: 'Descripcion de la Categoria Viajes'}
      ],
    }
  },
  computed: {
    formFields() {
      return {
        category: {
          value: "",
          type: "input",
          props: {
            label: "Buscar",
            icon: "search",
            color: "primary",
            rounded: true,
            dense: false
          },
        },
      };
    },
  },
}
</script>
<style>
.step-categories .item-category  {
  @apply tw-relative;
  transition: all .1s;
}
.step-categories .item-category-name {
  @apply tw-p-1;
} 
.step-categories  .activeClass .item-category-name {
  background-color: var(--q-color-primary);
} 
.step-categories .activeClass .tw-border {
  @apply tw-shadow-lg;
}
.step-categories .item-category:after {
  @apply tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent tw-rounded;
  transition: border-color .2s,top .2s,right .2s,bottom .2s,left .2s;
  content: "";
}
.step-categories .activeClass:after, .step-categories .item-category:hover:after {
  @apply tw--top-1.5 tw--right-1.5 tw--bottom-1.5 tw--left-1.5;
  border-color: var(--q-color-primary);
}
.step-categories .select-category {
  -webkit-animation: slide-tr 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-tr 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
.step-categories .categories-text {
  -webkit-animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	        animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
</style>