import {computed, reactive, ref, onMounted, toRefs} from "vue";
import service from '@imagina/qsite/_components/v3/demo/services'
import store from '@imagina/qsite/_components/v3/demo/store'

export default function controller(props: any, emit: any) {
  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
  }

  // Mounted
  onMounted(() => {
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods, store}
}
