import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance, markRaw} from "vue";
import { i18n, clone } from 'src/plugins/utils'


export default function controller(props, emit) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }
  

  // States
  const state = reactive({
    // Key: Default Value    
    paginationModel: {
      page: 1,
      rowsNumber: null,
      rowsPerPage: 10,
      descending: true,
      maxPages: 7 
    }    
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    rowsPerPageOption: computed(() => [5, 10, 20, 50, 100, 300, 500]),
  }
  

  // Methods
  const methods = {
    // methodKey: () => {}   
    init(){
      state.paginationModel = props.pagination
    },     

    countPage(pagination){
      const page = pagination.pagination.page
      const rowsPerPage = pagination.pagination.rowsPerPage
      const rowsNumber = pagination.pagination.rowsNumber
      const start = ((page * rowsPerPage) - rowsPerPage) + 1
      const ends = pagination.isLastPage ? rowsNumber : (page * rowsPerPage)
      return `${start} - ${ends} ${this.$tr('isite.cms.label.of')} ${rowsNumber}`
    },
    onClick(col, row){
      if(col?.onClick) col.onClick(col.value, row)
    }
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch
   watch(props, (newField, oldField): void => {
     state.paginationModel = newField.pagination
  
   }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
