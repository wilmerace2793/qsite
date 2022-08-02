<template>
  <div
    class="
      tw-bg-white
      tw-shadow
      tw-rounded
      tw-px-3
      tw-pt-3
      tw-pb-5
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
    <div class="tw-flex tw-mt-4 tw-justify-between tw-items-center">
      <span class="tw-text-sm tw-text-gray-600">{{ cardData.date }}</span>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        cardData:{
            type: Object,
            default: () => {},
        }
    }
}
</script>