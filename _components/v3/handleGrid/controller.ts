import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.proxy

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    items: []
  })

  // Computed
  const computeds = {
  }

  // Methods
  const methods = {
    orderedItems(data) {
      let tmpItems = data
      if (props.orderBy) {
        tmpItems.sort((a, b) => a[props.orderBy] - b[props.orderBy])
      }
      return tmpItems
    },
    updateSortOrder() {
      // Update sort_order based on the new position in the array
      //@ts-ignore
      const orderedItems = !props.orderBy ? state.items : state.items.map((item, index) => ({
        //@ts-ignore
        ...item,
        [props.orderBy]: index + 1
      }));
      // Emit an event to notify the parent component about the change
      emit('input', orderedItems);
    },
    addItem(currentItem) {
      const index = state.items.findIndex(i => i.id === currentItem.id);
      emit('create', { onCreate: (val) => methods.onCreate(index, val) })
    },
    onCreate(index, newItem) {
      if(index >= 0) {
        const newArray = proxy.$clone(state.items)
        newArray.splice(index + 1, 0, newItem)
        // Insert the new object at the specified position
        state.items = newArray;
      } else {
        state.items.push(newItem)
      }

      methods.updateSortOrder();
    },
    setState(items) {
      const data = items ?? props.value
      state.items = methods.orderedItems(data)
    }
  }

  // Mounted
  onMounted(() => {
    methods.setState()
  })

  // Watch
  // watch(() => props.value, (newField, oldField): void => {
  //   console.warn(">>>>>>>> Watch")
  //   state.items = computeds.orderedItems
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
