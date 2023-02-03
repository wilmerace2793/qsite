import { ref, computed } from 'vue';
export default function useExpressionField(props = {}, emit = null) {
  const inputKey = ref(null);
  const menu = ref(false);
  const inputData = ref('');
  const selectionStart = ref(0);
  const field = computed(() => props.fieldProps);
  const optionsList = computed(() => props.options);
  const inputDataComputed = computed({
    get() {
      return this.inputData;
    },
    set(value) {
      selectionStart.value = inputKey.value.$el.control.selectionStart || 0;
      inputData.value = value;
      emit("input", value);
    },
  });
  function getNativeElement($event) {
    try {
      if ($event.target) {
        selectionStart.value = $event.target.selectionStart;
      }
    } catch (error) {
      console.log(error);
    }
  }
  function selectKeyFromOptions(item) {
    try {
      let origString = inputDataComputed.value;
      origString = origString.split("");
      origString.splice(selectionStart.value, 0, `{{${item}}}`);
      const newString = origString.join("");
      inputDataComputed.value = newString;
    } catch (error) {
      console.log(error);
    }
  }
  return {
    menu,
    inputData,
    inputKey,
    selectionStart,
    inputDataComputed,
    selectKeyFromOptions,
    getNativeElement,
    field,
    optionsList,
  }
}