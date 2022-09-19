<template>
  <div
    class="
      tw-bg-white
      tw-shadow
      tw-rounded
      tw-px-3
      tw-pt-3
      tw-pb-2
      tw-border-l-2
      tw-my-2
    "
    :style="{ borderLeftColor: colorColumn }"
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
    <div v-if="cardData.type" class="tw-flex tw-mt-1 tw-justify-between tw-items-center">
      <span class="tw-text-xs tw-text-gray-600">
        <b>Tipo *</b> {{ cardData.type }}
      </span>
    </div>
    <div class="tw-flex tw-mt-1 tw-justify-between tw-items-center" 
      v-for="field in cardData.fields"
      :key="field.id"
    >
      <span 
        class="tw-text-xs tw-text-gray-600 tw-truncate" v-if="(field.name && typeof field.value !== 'object')"
      >
        <b>{{ field.name }} *</b> <span class="tw-lowercase">{{ field.value }}</span>
      </span>
    </div>
    
    <div class="tw-flex tw-mt-4 tw-justify-between tw-items-center">
      
      <span class="tw-text-xs tw-text-gray-600">
        <b>Fecha *</b> {{ cardData.createdAt }}
      </span>
    </div>
    <div class="tw-text-right" v-if="!automation">
      <q-btn flat round color="primary" size="xs" icon="fas fa-info-circle" @click="openModal">
        <q-tooltip class="bg-indigo" :offset="[10, 10]" >
          {{ $tr('isite.cms.label.information') }}
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" size="xs" icon="far fa-edit" @click="openEdit">
        <q-tooltip class="bg-indigo" :offset="[10, 10]">
          {{ $tr('isite.cms.label.edit') }}
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
    inject: {
      showRequestData: {
        type: Function,
        default: () => false
      },
      updateRequest: {
         type: Function,
         default: () => false
      },
      automation: {
         type: Boolean,
         default: () => false
      },
    },
    props: {
        cardData:{
            type: Object,
            default: () => {},
        },
        colorColumn: {
          type: String,
          default: () => '#00000',
        }
    },
    methods: {
      openModal() {
        if(this.showRequestData)this.showRequestData(this.cardData);
      },
      openEdit() {
        if(this.updateRequest)this.updateRequest(this.cardData.id);
        
      }
    }
}
</script>