<template>
  <div id="fileListComponent">
    <!--Table-->
    <q-table :data="tableData" :columns="tableColumns" :pagination.sync="table.pagination" :grid="table.grid"
             :hide-pagination="!allowPagination" :rows-per-page-options="table.rowsPerPageOptions"
             @request="getDataTable" :loading="loading" hide-no-data>
      <!---Top content-->
      <template v-slot:top>
        <div id="tableTopContent" class="row items-center justify-between full-width">
          <!--Left content-->
          <div class="text-blue-grey text-subtitle1">
            <!---Title-->
            <q-icon v-if="icon" :name="icon" class="q-mr-sm"/>
            <!---Title-->
            <b v-if="title">{{ title }}</b>
            <!--Counter-->
            <span v-if="allowCounter" class="q-ml-sm">({{ table.pagination.rowsNumber }})</span>
          </div>
          <!--Actions-->
          <div id="tableActions" class="row q-gutter-sm">
            <!--customActions-->
            <q-btn v-for="(item, itemKey) in actions" :key="itemKey" class="btn-small" v-bind="item"
                   v-if="item.vIf != undefined ? item.vIf : true" @click="item.action()">
              <q-tooltip v-if="item.tooltip">{{ item.tooltip }}.</q-tooltip>
            </q-btn>
            <!--Order-->
            <q-btn v-if="allowOrder" class="btn-small" round unelevated outline color="blue-grey"
                   :icon="`fas fa-arrow-${table.filter.order.way == 'asc' ? 'up' : 'down'}`" @click="toggleOrder()">
              <q-tooltip>{{ $tr('ui.label.order') }} {{ table.filter.order.way }}.</q-tooltip>
            </q-btn>
            <!--toogle view-->
            <q-btn v-if="allowChangeView" :icon="table.grid ? 'fas fa-grip-horizontal' : 'fas fa-list-ul'"
                   class="btn-small" @click="table.grid = !table.grid" round unelevated outline color="blue-grey">
              <q-tooltip>{{ $tr(`ui.message.${table.grid ? 'gribView' : 'listView'}`) }}</q-tooltip>
            </q-btn>
          </div>
        </div>
        <!--Separator-->
        <div class="full-width q-mt-sm" v-if="tableData.length">
          <q-separator/>
        </div>
      </template>
      <!--Custom Grid-->
      <template v-slot:item="props">
        <!---Card-->
        <div :class="`${gridColClass} q-pa-xs`" v-if="gridType == 'card'">
          <div class="file-card cursor-pointer">
            <!--Image Preview-->
            <div v-if="props.row.isImage" class="file-card_img img-as-bg" @click="fileAction(props.row)"
                 :style="`background-image: url('${props.row.mediumThumb}')`">
              <!--Tooltip-->
              <q-tooltip anchor="center middle" self="center middle" :delay="500">
                {{ props.row.filename }}
              </q-tooltip>
            </div>
            <!--Icon-->
            <div v-else class="file-card_icon img-as-bg row items-center justify-center"
                 @click="fileAction(props.row)">
              <q-icon :name="props.row.icon" color="blue-grey"/>
              <!--Tooltip-->
              <q-tooltip anchor="center middle" self="center middle" :delay="500">
                {{ props.row.filename }}
              </q-tooltip>
            </div>
            <!--Bottom content-->
            <div class="file-card__bottom">
              <!--Name-->
              <div class="file-card__bottom_title ellipsis">
                {{ props.row.filename }}
              </div>
              <!--Actions-->
              <div class="file-card__bottom_actions">
                <!--select file-->
                <q-checkbox v-if="allowSelect" v-model="table.selected" :val="props.row.filename" color="green"/>
                <!--button Actions-->
                <btn-menu class="" :actions="itemActions" :action-data="props.row"/>
              </div>
            </div>
          </div>
        </div>
        <!--Chips-->
        <div :class="`${gridColClass} q-pa-xs`" v-else-if="gridType == 'chip'">
          <div class="file-chip cursor-pointer">
            <!--Image Preview-->
            <div v-if="props.row.isImage" class="file-chip__img img-as-bg" @click="fileAction(props.row)"
                 :style="`background-image: url('${props.row.mediumThumb}')`">
            </div>
            <!--Icon-->
            <q-icon v-else :name="`fas fa-${props.row.isFolder ? 'folder' : 'file'}`" class="file-chip__icon"
                    @click="fileAction(props.row)"/>
            <!--Title-->
            <div class="file-chip__title ellipsis" @click="fileAction(props.row)">
              {{ props.row.filename }}
              <!--Tooltip-->
              <q-tooltip anchor="center middle" self="center middle" :delay="500">
                {{ props.row.filename }}
              </q-tooltip>
            </div>
            <!--Actions-->
            <div class="file-chip__actions">
              <!--select file-->
              <q-checkbox v-if="allowSelect" v-model="table.selected" :val="props.row.filename" color="green"/>
              <!--button Actions-->
              <btn-menu class="" :actions="itemActions" :action-data="props.row"/>
            </div>
          </div>
        </div>
      </template>
      <!--Custom columns-->
      <template v-slot:body-cell="props">
        <!--File Name-->
        <q-td v-if="props.col.name == 'filename'" :props="props" class="td-filename">
          <div @click="fileAction(props.row)" class="item-file row items-center cursor-pointer">
            <!--Icon-->
            <q-icon v-if="!props.row.isImage" :name="`fas fa-${props.row.isFolder ? 'folder' : 'file'}`"/>
            <!--Image-->
            <div class="file-image" v-else :style="`background-image: url('${props.row.mediumThumb}')`"></div>
            <!--Filename-->
            {{ props.value }}
          </div>
        </q-td>
        <!-- actions columns -->
        <q-td v-else-if="props.col.name == 'actions'" :props="props">
          <!--Actions-->
          <div class="file-card__bottom_actions">
            <!--select file-->
            <q-checkbox v-if="allowSelect" v-model="table.selected" :val="props.row.filename" color="green"/>
            <!--button Actions-->
            <btn-menu class="" :actions="itemActions" :action-data="props.row"/>
          </div>
        </q-td>
        <!--Default columns-->
        <q-td v-else :props="props" :title="props.value">
          {{ props.value }}
        </q-td>
      </template>
    </q-table>
    <!--Image preview-->
    <avatar-image ref="avatarImage" no-preview/>
    <!---PDF preview-->
    <master-modal v-model="modalPdf.show" :title="`PDF | ${modalPdf.fileName}`" width="100%">
      <iframe :src="modalPdf.src" width="100%" style="height: calc(100vh - 272px)"/>
    </master-modal>
    <!---Audio preview-->
    <master-modal v-model="modalAudio.show" :title="`Audio | ${modalAudio.fileName}`">
      <audio controls style="width: 100%">
        <source :src="modalAudio.src" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </master-modal>
    <!---Video preview-->
    <master-modal v-model="modalVideo.show" :title="`Video | ${modalVideo.fileName}`">
      <video width="100%" controls>
        <source :src="modalVideo.src" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </master-modal>
  </div>
</template>
<script>
export default {
  name: 'fileListComponent',
  components: {},
  props: {
    value: {default: null},
    gridType: {type: String, default: 'card'},
    icon: {default: false},
    title: {default: false},
    allowCounter: {type: Boolean, default: false},
    allowOrder: {type: Boolean, default: false},
    allowChangeView: {type: Boolean, default: false},
    actions: {
      type: Array, default: () => {
        return []
      }
    },
    gridColClass: {default: 'col-6 col-md-3 col-lg-2'},
    itemActions: {
      type: Array, default: () => {
        return []
      }
    },
    allowPagination: {type: Boolean, default: false},
    loadFiles: {default: false},
    allowSelect: {type: Number, default: 0}
  },
  watch: {
    value: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(this.table.data))
          this.table.data = this.$clone(newValue)
      }
    },
    'table.data': {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue))
          this.$emit('input', this.$clone(newValue))
      }
    },
    loadFiles: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
          this.table.pagination.page = 1
          this.getData()
        }
      }
    },
    'table.selected': {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue))
          this.handlerSelectedFiles()
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      table: {
        grid: true,
        data: [],
        pagination: {
          page: 1,
          rowsPerPage: 20,
          lastPage: 1,
          rowsNumber: 0
        },
        rowsPerPageOptions: [5, 10, 20, 50, 100, 300, 500],
        filter: {
          order: {
            field: 'created_at',
            way: 'desc'
          }
        },
        selected: []
      },
      modalPdf: {
        show: false,
        src: false,
        fileName: '',
      },
      modalAudio: {
        show: false,
        src: false,
        fileName: ''
      },
      modalVideo: {
        show: false,
        src: false,
        fileName: ''
      },
      selectedFiles: []
    }
  },
  computed: {
    //Table columns
    tableColumns() {
      return [
        {
          name: 'id', label: 'Id', field: 'id', align: 'left',
          sortable: true
        },
        {
          name: 'filename', label: this.$tr('ui.form.name'), field: 'filename', align: 'left',
          sortable: true
        },
        {
          name: 'type', label: this.$tr('ui.form.type'), align: 'left', field: 'id',
          format: (val, row) => row ? (row.isFolder ? this.$tr('ui.label.folder') :
              (row.isImage ? this.$tr('ui.label.image') : this.$tr('ui.label.file'))) : ''
        },
        {
          name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt',
          sortable: true, format: val => val ? this.$trd(val, {type: 'long'}) : '-'
        },
        {
          name: 'filesize', label: this.$tr('ui.label.size'), field: 'filesize',
          format: val => val ? this.$helper.formatBytes(val) : '-'
        },
        {name: 'actions', label: this.$trp('ui.label.action')},
      ]
    },
    //Table data
    tableData() {
      //Get data table
      let items = this.table.data || []

      //Icons by extensions
      let iconByExtension = {
        mp3: 'fas fa-file-audio',
        mp4: 'fas fa-file-video',
        pdf: 'fas fa-file-pdf',
        xlsx: 'fas fa-file-excel',
        xls: 'fas fa-file-excel',
        docx: 'fas fa-file-word',
        doc: 'fas fa-file-word',
        pptx: 'fas fa-file-powerpoint',
        ppt: 'fas fa-file-powerpoint',
      }

      //Transform data
      items.forEach(item => {
        //Set icon by extension
        item.icon = item.isFolder ? 'fas fa-folder' : (iconByExtension[item.extension] || 'fas fa-file')
        //Vlaidate extra format to image type
        if (['svg','jfif'].includes(item.extension)) item.isImage = true
      })

      //Response
      return items
    }
  },
  methods: {
    init() {
      this.table.data = this.$clone(this.value)
      this.getData()
    },
    //Get data
    getData(refresh = false) {
      //Call data table
      this.getDataTable({
        pagination: this.$clone(this.table.pagination),
        filter: this.$clone(this.table.filter)
      }, refresh)
    },
    //Get data table
    getDataTable({pagination, filter}, refresh = false) {
      return new Promise((resolve, reject) => {
        //Validate loadFiles options
        if (!this.loadFiles || !this.loadFiles.apiRoute) return resolve(false)
        //Loading
        this.loading = true
        //Update table filters
        this.table.filter = this.$clone({
          ...this.table.filter,
          ...(filter || {}),
          ...((this.loadFiles && this.loadFiles.requestParams) ? (this.loadFiles.requestParams.filter || {}) : {}),
        })
        //Request params
        let requestParams = {
          refresh: true,
          params: {
            page: this.$clone(pagination.page),
            take: this.$clone((this.loadFiles && this.loadFiles.requestParams) ?
                (this.loadFiles.requestParams.take || pagination.rowsPerPage) : pagination.rowsPerPage),
            filter: this.$clone(this.table.filter)
          }
        }
        //Set order by
        if (pagination.sortBy) {
          requestParams.params.filter.order = {
            field: pagination.sortBy,
            way: pagination.descending ? 'desc' : 'asc'
          }
        }

        //Request
        this.$crud.index(this.loadFiles.apiRoute, requestParams).then(response => {
          this.table.data = response.data
          //Set pagination
          this.table.pagination.page = this.$clone(response.meta.page.currentPage)
          this.table.pagination.rowsNumber = this.$clone(response.meta.page.total)
          this.table.pagination.lastPage = this.$clone(response.meta.page.lastPage)
          this.table.pagination.sortBy = this.$clone(pagination.sortBy)
          this.table.pagination.descending = this.$clone(pagination.descending)
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Do Item action
    fileAction(file) {
      //Action if is image
      if (file.isImage) {
        this.$refs.avatarImage.open(file.mediumThumb)
      }
      //Action if is PDF
      if (file.extension == 'pdf') {
        this.modalPdf = {
          show: true,
          src: file.path,
          fileName: file.filename
        }
      }
      //Action if is mp3
      if (file.extension == 'mp3') {
        this.modalAudio = {
          show: true,
          src: file.path,
          fileName: file.filename
        }
      }
      //Action if is mp4
      if (file.extension == 'mp4') {
        this.modalVideo = {
          show: true,
          src: file.path,
          fileName: file.filename
        }
      }
      //Emit selection item
      this.$emit('clickItem', file)
    },
    //Toggle order
    toggleOrder() {
      this.table.filter.order.way = this.$clone(this.table.filter.order.way == 'asc' ? 'desc' : 'asc')
      this.table.pagination.page = 1
      this.getData()
    },
    //Handler selected files data
    handlerSelectedFiles() {
      let dataFiles = []
      let selectedFiles = this.$clone(this.table.selected.slice(0, this.allowSelect))

      //Validate keep selected files
      this.selectedFiles.forEach(file => {
        if (selectedFiles.includes(file.filename)) dataFiles.push(file)
      })

      //Validate new files selected
      selectedFiles.forEach(filename => {
        if (!this.selectedFiles.map(file => file.filename).includes(filename)) {
          dataFiles.push(this.table.data.find(file => file.filename == filename))
        }
      })

      //Set selected files
      this.table.selected = this.$clone(selectedFiles)
      this.selectedFiles = this.$clone(dataFiles)
      //Emit selected files
      this.$emit('selected', this.$clone(this.selectedFiles))
    }
  }
}
</script>
<style lang="stylus">
#fileListComponent
  .q-table__container
    width 100%
    box-shadow none
    color $grey-9
    padding 10px

    .q-table__top
      padding 0

    thead
      th
        font-size 16px

    .td-filename //Table styles

      .item-file
        width max-content

        .q-icon
          font-size 25px
          margin-right 15px

        .file-image
          margin-right 15px
          height 36px
          width 36px
          background-repeat no-repeat
          background-position center
          background-size cover

    .file-card //Card styles
      color $grey-9
      background-color $grey-4
      border 1px solid $grey-3
      border-radius 5px
      overflow hidden
      position relative

      .file-card_img, .file-card_icon
        height 150px
        width 100%

      .file-card_icon
        .q-icon
          font-size 50px

      .file-card__bottom
        width 100%
        background-color white
        position relative
        height 36px

        .file-card__bottom_title
          font-size 12px
          padding 8px 13px 8px 5px
          color $grey-9
          text-transform lowercase
          width calc(100% - 26px)

        .file-card__bottom_actions
          position absolute
          right 2px
          top 0

    .file-chip
      border 1px solid $grey-5
      padding 5px
      border-radius 5px
      color $grey-8
      position: relative;
      height 38px

      .file-chip__img
        position absolute
        left 5px
        top 6.5px
        height 18px
        width 18px

      .file-chip__icon
        position absolute
        left 5px
        top 6.5px
        font-size 18px
        margin-right 5px

      .file-chip__title
        padding-left 23px
        padding-right 20px
        text-transform lowercase

      .file-chip__actions
        position absolute
        right 2px
        top 0

  th:last-child, td:last-child
    background-color white
    position: sticky
    right: 0
    z-index: 1
</style>

