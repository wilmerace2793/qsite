<template>
  <div class="step-categories">
    <h2 class="step-title">{{stepContent.title}} {{ selected.id }}</h2>

    <div class="tw-px-6 tw-pb-6 tw-mt-4">
      <dynamic-field v-model="name" :field="formFields.category"/>
    </div>

    <div class="tw-px-6 row" >
      <div class="col-12 col-sm-6 col-md-4 tw-mb-3 tw-cursor-pointer">
        <div class="text-category tw-truncate tw-text-base" 
            @click="getDataBase" 
            :class="{ 'text-primary tw-font-bold' : selected == '' }">
            Todas las categorias
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4 tw-mb-3 tw-cursor-pointer" 
          v-for="(item, index) in filteredCategories" 
          @click="selectData(item)">
        <div class="text-category tw-truncate tw-text-base" 
            :class="{ 'text-primary tw-font-bold' : item.id === selected.id }">
            {{item.title}}
        </div>
      </div>
    </div>

    <div class="tw-px-6 row">
      <div class="col-6 col-md-4 tw-mb-2 tw-p-2 tw-cursor-pointer" v-for="(item, index) in filteredCategories" @click="selectData(item)">
        <div class="item-category" :class="{ activeClass : item.id === selected.id }">
          <q-img 
                 :src="item.mediaFiles.mainimage.smallThumb"
                 :ratio="4/3"
                 class="tw-rounded-md tw-w-full"
          >
            <div class="item-category-name absolute-bottom tw-text-xs text-center tw-truncate">
              {{item.title}}
              <q-tooltip>
                {{item.title}}
              </q-tooltip>
            </div>
          </q-img>
        </div>
      </div>

    </div>

    <div class="step-sidebar">
      <div class="categories-text tw-max-w-sm">
        <p class="tw-text-base tw-mb-8 text-center">{{stepContent.summary}}</p>
        <img :src="stepContent.image" />
      </div>
    </div>

  </div>
</template>
<script>
import { THEME_BASE_ID } from './Model/constant.js';
export default {
  data() {
    return {
      loading: true,
      stepContent: {
        title: '¿Cuál es la categoría de tu página web?',
        summary: 'Con la selección de la categoría conoceremos la temática de tu sitio web, y podremos proporcionarte las plantillas con la estructura que más se adapten a tu negocio.',
        image: 'http://imgfz.com/i/R8AYr5e.png',
      },
      name:"",
      selected: "",
      categories: [],
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.navNext();
      this.getData();
    })
  },
  inject:['infoBase'],
  created() {
    console.warn(this.infoBase) // injected value
  },
  computed: {
    filteredCategories(){
      if(!this.name) { return this.categories }
      this.deselectCategory(this.name);
      return this.categories.filter((cate) => {
        return cate.title.toLowerCase().includes(this.name.toLowerCase());
      })
    },
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
      if(this.selected){
        this.$emit("update",  { active: true, info: this.selected.id});
      }else {
        this.$emit("update", { active: false});
      }
    },
    // busca info de una categoria especifica
    getData() {
      try {        
        // reviso si viene una categoria seleccionada y deberia trae una
        if(this.infoBase.category) {
          const id = this.infoBase.category;
          const params = {
            filter: {
              id
            }
          }
          this.$crud
          .index('apiRoutes.qcommerce.categories', {refresh : true, params})
          .then((response) => {
            const data = response.data;
            // si llega una id de categoria que no existe, limpia la base y llama a la categoria general
            if(data.length==0) {
              this.$alert.error({ message: "data vacia" });
              this.$emit("update",  { active: true, info: null});
              this.getDataBase();
            } else {
               this.categories = data;
               // si devuelve solo una entonces esa se selecciona automaticamente
               if(data.length==1) {
                this.selected = data[0];
                this.$emit("update",  { active: true, info: data[0].id});
               }
            }
            console.log(data);
            //this.loading = false;
          })
          .catch((error) => {
            this.$alert.error({ message: "No se cargo la info" });
            console.log(error);
          });

        } else {
          this.getDataBase();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // busca las categorias de la plantilla base
    getDataBase() {
      try {
        const params = {
          filter: {
            parentId: THEME_BASE_ID
          }
        };
        this.$crud
          .index('apiRoutes.qcommerce.categories', {refresh : true, params})
          .then((response) => {
            const data = response.data;
            this.categories = data;
            //this.loading = false;
          })
          .catch((error) => {
            this.$alert.error({ message: "No se cargo la info" });
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    deselectCategory(value) {
      this.selected="";
      this.name=value;
      this.navNext();
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
  @apply tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent tw-rounded-md;
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