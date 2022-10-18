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
      kb-card
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
          tw-w-full
        "
      >
        <q-btn-dropdown v-if="!automation" round color="gray-4" flat size="10px" padding="5px 5px" 
              class="kd-without-arrow
                    tw-float-right
                    tw-cursor-pointer
                    tw-text-xs tw-bg-gray-100" 
                    icon="fa-solid fa-ellipsis">
          <q-list dense class="tw-p-2 kd-list-without-arrow tw-bg-gray-100 tw-text-xs">
            <q-item clickable v-close-popup @click="openModal">
              <q-item-section avatar>
                <q-icon name="fa-regular fa-square-info" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $tr('isite.cms.label.information') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="openEdit">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-pen-to-square" />
              </q-item-section>
              <q-item-section  class="tw-p-1">
                <q-item-label>{{ $tr('isite.cms.label.edit') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

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
<style>
.kd-without-arrow .q-btn-dropdown__arrow {
  @apply tw-hidden !important;
}
.kd-list-without-arrow .q-item__section--avatar {
  @apply tw-mx-1 tw-pr-1 !important tw-min-w-0 !important;
}
</style>