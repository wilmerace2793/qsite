<template>
  <div>
    <q-btn 
      icon="fa-solid fa-ellipsis" 
      size="sm" 
      round 
      unelevated
    >
      <q-menu>
        <q-list class="tw-w-full">
          <q-item
            clickable
            v-close-popup
            v-for="(item, index) in optionsList"
            :key="index"
            @click.prevent="selectKeyFromOptions(item.value)"
          >
            <q-item-section class="tw-px-2">
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-input
      ref="inputKey"
      v-model="inputDataComputed"
      v-bind="field"
      outlined
      class="tw-bg-white"
      @click="getNativeElement"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import useExpressionField from './useExpressionField.js';
export default defineComponent({
  props: {
    fieldProps: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, {emit}) {
    const {
      menu,
      inputData,
      inputKey,
      selectionStart,
      inputDataComputed,
      selectKeyFromOptions,
      getNativeElement,
      field,
      optionsList
    } = useExpressionField(props, emit);
    return {
      menu,
      inputData,
      selectionStart,
      inputDataComputed,
      selectKeyFromOptions,
      getNativeElement,
      inputKey,
      field,
      optionsList,
    }
  },
})
</script>