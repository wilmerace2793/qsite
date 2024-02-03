import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import {debounce} from 'quasar';
import handleGrid from '@imagina/qsite/_components/v3/handleGrid/index.vue';

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.proxy

  // Refs
  const refs = {}

  interface StateProps {

  }

  // States
  const state = reactive({})

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
    handleChangeDraggable() {
      console.warn(">>>> Pendiente", props.elements)
      props.elements.forEach((item, index) => {
        //Apply order
        item[props.orderBy] = index
        //Apply parent
        item[props.parentField] = props.parentValue
      })
    },
    addItem(currentItem) {
      const index = props.elements.findIndex(i => i.id === currentItem.id);
      emit('create', {index, parentId: 0, onCreate: (val) => methods.onCreate(index, val)})
    },
    onCreate(index, newItem) {
      if (index >= 0) {
        const newArray = proxy.$clone<any[]>(props.elements)
        newArray.splice(index + 1, 0, newItem)
        // Insert the new object at the specified position
        props.elements = newArray;
      } else {
        props.elements.push(newItem)
      }

      methods.updateSortOrder();
    },
    //Updated Item
    updateItem(newValue, keySearch = 'id') {
      //Search if exist the item
      const itemIndex = props.elements.findIndex(i => i[keySearch] === newValue.id);

      //If exist replace the item with the new item value
      if (itemIndex >= 0) {
        props.elements.splice(itemIndex, 1, newValue)
      }
    },
    //Check if exist key in the element
    verifyKeys(element, key) {
      const arrayKeys = Object.keys(element);
      return arrayKeys.includes(key)
    },
    //Add child in Grid
    addedChildItem(index, parentId, childObj) {
      let response = childObj
      if (response.parentId == 0) {
        response.parentId = parentId
      }

      emit('create', response)
    },
  }

  // Mounted
  onMounted(() => {

  })

  // Watch
  // watch(() => props.value, (newField, oldField): void => {
  //   console.warn(">>>>>>>> Watch")
  //   props.elements = computeds.orderedItems
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
