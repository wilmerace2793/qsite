<template>
  <div class="step-categories">
    <h2 class="step-title">{{stepContent.title}}</h2>

    <div class="tw-px-6 tw-pb-6 tw-mt-4">
      <dynamic-field v-model="name" :field="formFields.category" @input="searchCategory()"/>
    </div>

    <div class="tw-px-6 row">
      <div class="col-6 col-md-4 tw-mb-2 tw-p-3 tw-cursor-pointer" v-for="(item, index) in categories" @click="selectData(item)">
        <div class="item-category" :class="{ activeClass : item.name === selected.name }">
          <q-img 
                 :src="item.image"
                 :ratio="4/3"
                 class="tw-rounded tw-w-full"
          >
            <div class="item-category-name absolute-bottom tw-text-sm text-center">
              {{item.name}}
            </div>
          </q-img>
        </div>
      </div>

    </div>

    <div class="step-sidebar">
      <div class="categories-text tw-max-w-sm">
        <p class="tw-text-sm tw-mb-8 text-center">{{stepContent.summary}}</p>
        <img :src="stepContent.image" />
      </div>
    </div>

  </div>
</template>
<script>

export default {
  data() {
    return {
      stepContent: {
        title: '¿Cuál es la temática de tu página web?',
        summary: 'Con la seleccion de la categoria conoceremos la temática de tu sitio web, y podremos proporcionarte las plantillas con los textos y la estructura que más se adapten a tu negocio.',
        image: 'http://imgfz.com/i/R8AYr5e.png',
      },
      name:"",
      selected: "",
      categories: [],
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.navNext()
    })
  },
  computed: {
    formFields() {
      return {
        category: {
          value: "",
          type: "search",
          props: {
            label: "Buscar",
            color: "primary",
            rounded: true,
            dense: false
          }
        },
      };
    },
  },
  methods: {
    selectData(item) {
      this.selected=item;
      this.navNext();
    },
    navNext() {
      if(this.selected!==''){
        this.$emit("update",  { active: true, info: this.selected.id});
      }else {
        this.$emit("update", { active: false});
      }
    },
    searchCategory(){
      console.log(this.name.length);
      if(this.name!==''){
        console.log('Llamado de las categorias');
        this.categories = [
          { id: 1, name:'Tienda', image: 'http://imgfz.com/i/z2Er0Rq.jpeg', description: 'Descripcion de la Categoria Tienda'},
          { id: 2, name:'Arquitectura', image: 'http://imgfz.com/i/G9N74Sv.jpeg', description: 'Descripcion de la Categoria Arquitectura'},
          { id: 3, name:'Viajes', image: 'http://imgfz.com/i/UpxX59i.jpeg', description: 'Descripcion de la Categoria Viajes'}
        ];
      } else {
        this.categories = [];
      }
    }
  }
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
.step-categories .select-category, .step-categories .categories-text {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
</style>