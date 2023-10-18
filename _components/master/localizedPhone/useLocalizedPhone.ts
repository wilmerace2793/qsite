import { ref, computed, onMounted, watch } from 'vue';
import getCountries from '@imagina/qsite/_components/master/localizedPhone/actions/getCountries';
export default function useLocalizedPhone(props: any = {}, emit: any = null) {
  const loading = ref(false);
  const inputKey: any = ref(null);
  const menu = ref(false);
  const inputData: any = ref('');
  const isDrop = ref(false);
  const searchTerm = ref('');
  const selectionStart = ref(0);
  const field = computed(() => props.fieldProps);
  const seletdCountry = ref({name: 'Colombia', iso3: 'COL', callingCode: 57 });
  const listCountries = ref([]);
  const inputDataComputed = computed({
    get() {
      return inputData.value;
    },
    set(value) {
      selectionStart.value = inputKey.value.$el.control.selectionStart || 0;
      inputData.value = value;
      emit("input", `+${seletdCountry.value.callingCode}${value}`);
    },
  });
  const filteredCountries = computed(() => {
    return listCountries.value.filter(item => {
      const country: any = item;
      const nameLowerCase = country.name.toLowerCase();
      const codeLowerCase = String(country.callingCode);
      const termLowerCase = searchTerm.value.toLowerCase();
      return nameLowerCase.includes(termLowerCase) || codeLowerCase.includes(termLowerCase);
    });
  })
  function getNativeElement($event) {
    try {
      if ($event.target) {
        selectionStart.value = $event.target.selectionStart;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function setCountries() {
    listCountries.value = await getCountries();
  } 
  async function init() {
    inputDataComputed.value = props.value;
  }
  onMounted(async () => {
    await setCountries();
    await init();
  })
  function setSeletdCountry(country) {
    seletdCountry.value = country;
    searchTerm.value = '';
    emit("input", `+${seletdCountry.value.callingCode}${inputDataComputed.value}`);
  }
  watch(isDrop, (newValue) => {
    if(!newValue) searchTerm.value = '';
  }, { deep: true });
  return {
    menu,
    inputData,
    inputKey,
    selectionStart,
    inputDataComputed,
    getNativeElement,
    field,
    init,
    listCountries,
    seletdCountry,
    setSeletdCountry,
    filteredCountries,
    searchTerm,
    isDrop
  }
}