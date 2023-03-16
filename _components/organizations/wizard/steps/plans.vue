<template>
  <div class="step-plan">
    <h2 class="step-title">{{stepContent.title}}</h2>

    <q-list
      bordered 
      separator 
      class="tw-mb-4 cursor-pointer tw-rounded-md item-plan tw-mx-6"
      @click="selectPlan(item)"  
      :class="{ activePlan : item.name === selected.name }"
      v-for="(item, index) in plans" :key="index">
      <q-expansion-item 
        group="plan"
        expand-icon-toggle
        v-model="item.expanded"
        hide-expand-icon
      >
        <template v-slot:header>
          <q-item-section>
            <div class="tw-text-lg tw-font-semibold">{{item.name}}</div>
            <div class="tw-text-xs">{{ item.summary }}</div>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center ">
              <span class="tw-font-bold">{{item.formattedPrice}}</span> 
            </div>
          </q-item-section>
        </template>
        <q-card>
          <q-separator />
          <q-card-section v-html="item.description"></q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div class="step-sidebar">
      <q-card class="select-card tw-border-t-8 tw-max-w-lg" flat bordered v-if="selected">
        <q-card-section>
          <div class="text-h5 q-mb-xs">{{selected.name}}</div>
           <div class="text-caption text-grey overflow-ellipsis overflow-hidden">{{selected.summary }}</div>
          <div class="text-right">
            <span class="text-h6 tw-font-bold text-primary ">{{selected.formattedPrice}}</span> 
          </div>  
        </q-card-section>
        <q-separator />
        <q-card-section class="tw-text-xs" v-html="selected.description"></q-card-section>
      </q-card>

      <div class="select-card tw-max-w-md" v-else>
        <p class="tw-text-base tw-mb-8 text-center">{{stepContent.summary}}</p>
        <img :src="stepContent.image"/>
      </div>
    </div>

  </div>
</template>
<script>
import { PLAN_BASE_ID, CATEGORY_ECOMMERCE_ID } from './Model/constant.js';
export default {
  data() {
    return {
      stepContent: {
        title: 'Elige la frecuencia de tu Plan Wygo ',
        summary: '',
        image: 'http://imgfz.com/i/5QUbYWt.png',
      },
      selected:"",
      plans: [],
    }
  },
  inject:['infoBase'],
  created() {
    console.warn(this.infoBase) // injected value
  },
  mounted() {
    this.$nextTick(async function () {
      this.navNext();
      this.getData();
    })
  },
  methods: {
    selectPlan(plan) {
      plan.expanded = true;
      this.selected = plan;
      this.navNext();
    },
    navNext() {
      if(this.selected!==''){
        this.$emit("update", { active: true, info: this.selected.id});
      }else {
        this.$emit("update", { active: false});
      }
    },
    getData() {
      try {

        const params = {
          filter: {
            categories: PLAN_BASE_ID
          }
        };
        this.$crud
          .index('apiRoutes.qcommerce.products', {refresh : true, params})
          .then((response) => {
            const data = response.data;
            this.plans = data.map((item) => ({
              ...item,
              expanded: false,
            }));
            console.warn(data);
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
  }
}
</script>
<style>
.step-plan .select-card {
  border-color: var(--q-color-primary);
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-plan .item-plan  {
  @apply tw-p-0 tw-relative;
  transition: background-color .1s,color .1s;
}
.step-plan .activePlan .q-item {
  @apply tw-text-white;
  background-color: var(--q-color-primary);
}
.step-plan .activePlan .q-expansion-item--collapsed {
  @apply tw-text-white tw-rounded-md;
}
.step-plan .activePlan .q-expansion-item--expanded {
  @apply tw-rounded-t-md tw-rounded-b-none;
}
.step-plan .activePlan .q-expansion-item__content {
  @apply tw-border;
  border-color: var(--q-color-primary);
}
.step-plan .activePlan .q-item__section--side {
  @apply tw-text-white;
  transition: color .1s;
}
.step-plan .item-plan .q-expansion-item:after {
  @apply tw-rounded-md tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-border tw-border-transparent;
  transition: border-color .2s,top .2s,right .2s,bottom .2s,left .2s;
  content: "";
}
.step-plan .activePlan .q-expansion-item:after, .step-plan .item-plan:hover .q-expansion-item:after {
  @apply tw--top-1.5 tw--right-1.5 tw--bottom-1.5 tw--left-1.5;
  border-color: var(--q-color-primary);
}
</style>

