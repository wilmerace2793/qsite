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
            v-for="(item, index) in options"
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
      v-bind="fieldProps"
      outlined
      class="tw-bg-white"
      @click="getNativeElement"
    />
  </div>
</template>

<script>
export default {
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
  data: () => ({
    menu: false,
    inputData: "",
    selectionStart: 0,
  }),
  computed: {
    inputDataComputed: {
      get() {
        return this.inputData;
      },
      set(value) {
        this.inputData = value;
        this.$emit("input", value);
      },
    },
  },
  methods: {
    getNativeElement($event) {
      try {
        if ($event.target) {
          this.selectionStart = $event.target.selectionStart;
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectKeyFromOptions(item) {
      try {
        let origString = this.fieldDataComputed;
        let stringToAdd = `{{${item}}`;
        let indexPosition = this.selectionStart;
        origString = origString.split("");
        origString.splice(indexPosition, 0, stringToAdd);
        const newString = origString.join("");
        this.inputDataComputed = newString;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>