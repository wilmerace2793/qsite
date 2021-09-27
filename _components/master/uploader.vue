<template>
  <div id="uploaderMasterComponent" class="full-width">
    <!--File List-->
    <file-list v-model="filesData" v-bind="fileListParams" v-if="!hideFileList"/>
    <!--Uploader image-->
    <q-uploader ref="qUploaderComponent" v-show="false" :accept="acceptFiles" @added="setFiles"
                :max-files="maxFiles - filesData.length" :multiple="maxFiles >= 2 ? true : false"/>
  </div>
</template>
<script>
//components
import fileList from '@imagina/qsite/_components/master/fileList'

export default {
  name: 'uploaderComponentMaster',
  props: {
    value: {default: false},
    accept: {default: '.pdf,.xlsx,.xls,.docx,.doc,.pptx,.ppt,.mp4,.mp3,.jpg,image/*'},
    maxFiles: {default: 1},
    title: {default: ''},
    emitBase64: {type: Boolean, default: false},
    emitFile: {type: Boolean, default: false},
    gridColClass: {default: 'col-6 col-md-3 col-lg-2'},
    hideFileList: {type: Boolean, default: false}
  },
  components: {fileList},
  watch: {
    value: {
      deep: true,
      handler: function (newValue, oldValue) {
        this.setValueToFileData()
      }
    },
    filesData() {
      this.emitFiles()
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
      filesData: []
    }
  },
  computed: {
    //Params to file List
    fileListParams() {
      return {
        title: `${this.$clone(this.title)} (${this.filesData.length}/${this.maxFiles})`,
        gridColClass: this.gridColClass,
        actions: [
          {
            label: this.$tr('ui.label.select'),
            icon: 'fas fa-file-upload',
            padding: 'xs sm',
            color: 'green',
            rounded: true,
            outline: true,
            action: () => this.pickFiles(),
            disable: this.filesData.length >= this.maxFiles ? true : false
          }
        ],
        itemActions: [
          {
            label: this.$tr('ui.label.delete'),
            icon: 'fas fa-trash',
            action: (item) => {
              let fileIndex = this.filesData.findIndex(file => item.id == file.id)
              if (fileIndex >= 0) this.filesData.splice(fileIndex, 1)
            }
          }
        ]
      }
    },
    //Return accept files
    acceptFiles() {
      //Images
      if (this.accept == 'images') return '.jpg, image/*'
      //documents
      if (this.accept == 'documents') return '.pdf, .xlsx, .docx, .pptx'
      //Media
      if (this.accept == 'media') return '.mp4, .mp3, .jpg, image/*'

      //Default
      let mediaConfig = this.$store.state.qsiteApp.configs.Media

      return this.$clone(mediaConfig ? mediaConfig['allowed-types'] : this.accept)
    }
  },
  methods: {
    init() {
      this.setValueToFileData()
      this.emitFiles()
    },
    //pick files
    pickFiles() {
      this.$refs.qUploaderComponent.pickFiles()
    },
    //Set value to file data
    setValueToFileData() {
      if (this.value) {
        let newFilesData = this.$clone(Array.isArray(this.value) ? this.value : [this.value])
        let filesData = this.$clone(this.filesData)

        //Default condition to set new files
        let setFiles = newFilesData.length != filesData.length ? true : false
        //Set files
        if (setFiles) this.setFiles(this.$clone(newFilesData), true)
      }
    },
    //Get file information
    setFiles(files, replacing = false) {
      this.loading = true
      setTimeout(async () => {
        //Clear file data
        if (replacing) this.filesData = []
        //default files data
        let filesData = this.$clone(this.filesData)
        //Transform file information
        for (const file of files) {
          //Default file data
          let fileData = file
          //If file isn't a string
          if (typeof file !== 'string') {
            //Get base 64
            let base64 = await this.$helper.getBase64(file)
            //File data
            fileData = {
              id: this.$uid(),
              file: file,
              name: file.name,
              filename: file.name,
              size: file.size,
              type: file.type,
              base64: base64,
              mediumThumb: base64,
              path: base64,
              isImage: file.__img ? true : false,
              width: file.__img ? file.__img.naturalWidth : 0,
              height: file.__img ? file.__img.naturalHeight : 0,
              extension: file.name.split('.').pop()
            }
            //Crop image
            if (file.__img) {
              await new Promise((resolve, reject) => {
                this.$eventBus.$emit('master.cropper.image', {
                  src: base64,
                  type: fileData.type,
                  callBack: async (fileCropped) => {
                    if (fileCropped) {
                      //Merge data
                      fileData = {...fileData, ...fileCropped}
                      //Get file
                      fileData.file = await this.$helper.urlToFile(fileData.base64, file.name, file.type)
                    }
                    //Cancel emit file
                    else fileData = null

                    //Resolve
                    resolve(true)
                  }
                })
              })
            }
          } else { //if file us a url
            if (file.includes('http://') || file.includes('https://')) {
              //Get file data from url
              let urlFile = new URL(file)
              let splitPath = urlFile.pathname.split('/')
              let fileName = splitPath[splitPath.length - 1]
              let extension = fileName.split('.').pop()
              //Instance file data
              fileData = {
                id: this.$uid(),
                file: file,
                base64: file,
                mediumThumb: file,
                filename: fileName,
                extension: extension,
                isImage: ['jpg', 'png', 'webp'].includes(extension)
              }
            }
          }

          //Set file data
          if (fileData) filesData.push(fileData)
        }

        //Set to files data
        this.filesData = this.$clone(filesData)
        //Reset uploader
        this.$refs.qUploaderComponent.reset()
        //Hide loading
        this.loading = false
      }, 500)
    },
    //Emit response
    emitFiles() {
      let files = this.$clone(this.filesData)//Files
      let response = this.$clone(files)//Default response
      //Get only file
      if (this.emitFile) response = files.map(file => file.file || file)
      //Get only base64
      if (this.emitBase64) response = files.map(file => file.base64 || file)
      //Filter response quantity
      response = this.$clone((this.maxFiles >= 2) ? response : (response[0] || null))
      //Emit response
      this.$emit('input', response)
    },
    //Reset
    reset() {
      this.filesData = []
    }
  }
}
</script>
<style lang="stylus">
#uploaderMasterComponent
  color $grey-9
  display inline-grid

  #contentUploader
    .file-block
      border 1px dashed $grey-5
      border-color $blue
      border-radius 5px
      cursor pointer
      position relative

      .file-block_content
        height 150px

      .file-block_loaded
        background-color $grey-4
        height 126px

      .file-block_icon
        font-size 50px
        color $blue

      .file-block_title
        font-size 12px
        padding 3px 4px

    .btn-delete
      position absolute
      top 5px
      right -5px
      background $red
      color white
      height 35px
      width 35px
      border-radius 50%
      cursor pointer
      z-index 99
</style>
