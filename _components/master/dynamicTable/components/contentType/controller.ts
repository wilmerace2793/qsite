import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef} from "vue";


export default function controller(props, emit) {  

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    component: shallowRef()
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    //data to display
    onClick: computed(() => props.col?.onClick ? props.col.onClick : () => {}),
    isClickeable: computed(() => props.col?.onClick ? true : false),
    isComponent: computed(() => props.col?.component || false ),
    isLoading: computed(() => props.row?.isLoading || false),
    showOnLoading: computed(() =>  computeds.isLoading.value && props.col.name != 'id')
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init() {
      methods.loadComponent();
    },
    loadComponent(){
      if(computeds.isComponent.value){        
        state.component = markRaw(props.col.component)
      }
    }
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
