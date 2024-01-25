import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.proxy

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  interface StateProps {
    items: any[]
  }

  // States
  const state = reactive<StateProps>({
    items: []
  })

  // Computed
  const computeds = {
    actionButtonProps: computed(() => ({
      icon: 'fa-regular fa-objects-column',
      outline: true,
      round: true,
      color: 'cyan',
      size: '10px'
    }))
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
      const orderedItems = !props.orderBy ? state.items : state.items.map((item, index) => ({
        ...item,
        [props.orderBy]: index + 1
      }));
      // Emit an event to notify the parent component about the change
      emit('input', orderedItems);
    },
    addItem(currentItem) {
      const index = state.items.findIndex(i => i.id === currentItem.id);
      emit('create', {index, onCreate: (val) => methods.onCreate(index, val)})
    },
    onCreate(index, newItem) {
      if (index >= 0) {
        const newArray = proxy.$clone<any[]>(state.items)
        newArray.splice(index + 1, 0, newItem)
        // Insert the new object at the specified position
        state.items = newArray;
      } else {
        state.items.push(newItem)
      }

      methods.updateSortOrder();
    },
    setState(items = null) {
      const data = items ?? props.value
      state.items = methods.orderedItems(data)
    },
    //Updated Item
    updateItem(newValue, keySearch = 'id') {
      //Search if exist the item
      const itemIndex = state.items.findIndex(i=> i[keySearch] === newValue.id);

      //If exist replace the item with the new item value
      if(itemIndex) {
        state.items.splice(itemIndex, 1, newValue)
      }
    },
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
