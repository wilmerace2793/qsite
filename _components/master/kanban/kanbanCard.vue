<template>
  <div
    class="
      tw-bg-white
      tw-shadow
      tw-rounded
      tw-px-3
      tw-pt-3
      tw-pb-2
      tw-border
      tw-border-white
      tw-my-2
      tw-mx-2
    "
  >
    <div class="tw-flex tw-justify-between">
      <p
        class="
          tw-text-gray-700
          tw-font-semibold
          tw-font-sans
          tw-tracking-wide
          tw-text-sm
        "
      >
        {{ cardData.title }}
      </p>
    </div>
    <div class="tw-flex tw-mt-1 tw-justify-between tw-items-center">
      <span class="tw-text-xs tw-text-gray-600">
        <b>Tipo *</b> {{ cardData.type }}
      </span>
    </div>
    <div class="tw-flex tw-mt-1 tw-justify-between tw-items-center" 
      v-for="field in cardData.fields"
      :key="field.id"
    >
      <span 
        class="tw-text-xs tw-text-gray-600" v-if="field.label"
      >
        <b>{{ field.label }}</b> <span class="tw-lowercase">{{ field.value }}</span>
      </span>
    </div>
    
    <div class="tw-flex tw-mt-4 tw-justify-between tw-items-center">
      
      <span class="tw-text-xs tw-text-gray-600">
        <b>Fecha *</b> {{ cardData.date }}
      </span>
    </div>
    <div class="tw-text-right">
      <q-btn flat round color="primary" size="xs" icon="fas fa-info-circle" @click="openModal">
        <q-tooltip class="bg-indigo" :offset="[10, 10]" >
          {{ $tr('isite.cms.label.information') }}
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" size="xs" icon="far fa-edit" >
        <q-tooltip class="bg-indigo" :offset="[10, 10]">
          {{ $tr('isite.cms.label.edit') }}
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
    inject: ['showRequestData'],
    props: {
        cardData:{
            type: Object,
            default: () => {},
        }
    },
    methods: {
      openModal() {
        console.log(this.cardData);
        this.showRequestData(this.cardData);
      }
    }
}
</script>