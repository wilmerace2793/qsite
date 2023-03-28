<template>
  <div class="step-categories">
    <div class="step-loading" v-if="loading"><div></div><div></div></div>

    <div v-else>
    <h2 class="step-title">{{stepContent.title}}</h2>
    <div class="tw-px-6 tw-pb-6 tw-mt-4 tw-mb-2">
      <dynamic-field v-model="name" :field="formFields.category" @input="getCategoriesName"/>
    </div>
    
    <div class="tw-px-6">
      <div class="row q-gutter-sm justify-between tw-mb-4">
        <div class="col-auto tw-mb-3" 
            v-for="(item, index) in categories" 
            @click="selectData(item)">
          <div class="text-category 
                      tw-text-sm 
                      tw-rounded-lg 
                      tw-px-3 
                      tw-py-1 
                      tw-cursor-pointer" 
              :class="{ 'text-active-cate' : item.id === selected.id }">
              {{item.title}}
          </div>
        </div>
      </div>
    </div>
  </div>

    <!--
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

    </div>-->

    <div class="step-sidebar">
      <div class="step-loading" v-if="loadingSidebar"><div></div><div></div></div>
      <div class="categories-text tw-max-w-sm tw-w-full" v-else>
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
  THEME_BASE_ID, 
  STEP_NAME_CATEGORIES } from './model/constant.js';
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
      stepContent: '',
      name:'',
      selected: '',
      categories: [],
    }
  },
  mounted() {
    this.$nextTick(async function () {
      this.navNext();
      this.getData();
      this.getStepInfo();
    })
  },
  inject: {
    infoBase: {
      type: Object,
      default: () => {},
    },
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
      if(this.selected){
        this.$emit("update",  { active: true, info: this.selected});
      }else {
        this.$emit("update", { active: false});
      }
    },
    async getData() {
      try {        
        if(this.infoBase.category) {
          this.selected=this.infoBase.category;
          this.$emit("update",  { active: true, info: this.selected});
        }
        this.getDataBase();
      } catch (error) {
        console.log(error);
      }
    },
    async getDataBase() {
      try {
        const params = {
          filter: {
            title: THEME_BASE_ID
          }
        };
        this.loading=true;
        await this.$crud
          //.index('apiRoutes.qcommerce.categories', {refresh : true, params})
          .index('apiRoutes.qsite.categories', {refresh : true})
          .then((response) => {
            const data = response.data;
            this.categories = this.orderArray(data);
            this.loading = false;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getCategoriesName() {
      try {
        if(this.name.length>3) {
          this.deselectCategory(this.name);
          const params = {
            filter: {
              search: this.name
            }
          };
          this.loading=true;
          await this.$crud
            //.index('apiRoutes.qcommerce.categories', {refresh : true, params})
            .index('apiRoutes.qsite.categories', {refresh : true, params})
            .then((response) => {
              const data = response.data;
              console.log(data);
              console.log('hola');
              this.categories = this.orderArray(data);
              this.loading = false;
            })
            .catch((error) => {
              console.log(error);
            });
        }

      } catch (error) {
        console.log(error);
      }
    },
    deselectCategory(value) {
      this.selected="";
      this.name=value;
      this.navNext();
    },
    orderArray(array) {
      array.sort((a, b) => a.title.localeCompare(b.title));
      return array;
    },
    async getStepInfo() {
      this.stepContent = this.info.find((item) => item.systemName === STEP_NAME_CATEGORIES);
    },
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
.step-categories .text-category {
  @apply tw-relative;
  border-width: 1px; border-color: var(--q-color-primary);
}

.step-categories .text-category:after {
  @apply tw-rounded-lg tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent;
  transition: border-color .2s,top .2s,right .2s,bottom .2s,left .2s;
  z-index: -1;
  content: "";
}
.step-categories .text-active-cate,
.step-categories .text-category:hover {
  @apply tw-text-white;
}
.step-categories .text-active-cate:after, 
.step-categories .text-category:hover:after {
  @apply tw--top-1 tw--right-1 tw--bottom-1 tw--left-1;
  background: var(--q-color-primary);
}
</style>