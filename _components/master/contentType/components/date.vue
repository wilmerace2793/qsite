<template>
  <div 
    v-if="date"
    style="width: 90px;"
  >
    <q-chip 
      outline
      text-color="white"
      :color="state.color"
      class="q-py-none full-width"
    >
    <div class="full-width">
      <i v-if="state?.icon" :class="state.icon"></i>
      &nbsp;{{ formatedDate }}
      <q-tooltip>{{ date }}</q-tooltip>
    </div>
    </q-chip>
  </div>
  </template>
  <script lang="ts">
  import {defineComponent} from 'vue'
  import moment from 'moment';
  
  const states = {
    notExpired: {
      color: 'gray', 
      icon: ''
    },
    expired: {
      color: 'red', 
      icon: 'fa-regular fa-calendar-circle-exclamation'
    }  
  }
  
  export default defineComponent({
    props: {
      date: {default: null},
      expirationDate: {default: null},
      dateFormat: {default: 'YYYY/MM/DD'}
    },
    computed: {
      state(){
        if(!this.expirationDate) return states.notExpired
        return moment(this.expirationDate).format(this.dateFormat) > moment(this.date).format(this.dateFormat) ? states.expired : states.notExpired
      }, 
      formatedDate(){
        return moment(this.date).format('MMM D')
      }
    }
  })
  </script>
  <style lang="scss">
  </style>