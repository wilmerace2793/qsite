<template>
  <div id="ckEditorComponent">
    <ck-editor v-model="responseValue"
               :config="configEditor"
               @namespaceloaded="onNamespaceLoaded"
               :ref="`ref-${internalName}`"
               :id="`id-${internalName}`"
    />
    <!--inner loading-->
    <inner-loading :visible="loading" />
  </div>
</template>
<script>
//Components
import CKEditor from '@mayasabha/ckeditor4-vue3';
//Custom Plugins
import pluginCollapsibleItem from 'src/plugins/ckEditorPlugins/collapsibleItem/plugin'
import pluginGrid from 'src/plugins/ckEditorPlugins/grid/plugin'
import pluginEmbed from 'src/plugins/ckEditorPlugins/embed/plugin'
import pluginFa from 'src/plugins/ckEditorPlugins/ckeditorfa-fa6/plugin'

/* range 7px to 36px*/
let fontSizes =  Array.from({length: 30}, (_, index) => `${7+index * 1}/${7 +index * 1}px;`)
fontSizes.push('48/48px;72/72px;96/96px;')

export default {
  props: {
    modelValue: {default: ''},
    name: {default: null}
  },
  emits: ['update:modelValue'],
  components: {ckEditor: CKEditor.component},
  watch: {
    modelValue(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue))
        this.responseValue = this.$clone(newValue)
    },
    responseValue(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue))
        this.$emit('update:modelValue', this.$clone(newValue))

    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      responseValue: '',
      loading: false,
      configEditor: {
        allowedContent: true,
        filebrowserBrowseUrl: this.configModules('main.qmedia.moduleName') ? this.$router.resolve({name: 'app.media.select'}).href : null,
        extraPlugins: 'colorbutton,colordialog,justify,collapsibleItem,font,btgrid,simplebox,ckeditorfa',
        embed_provider: '//iframe.ly/api/oembed?url={url}&callback={callback}&api_key=7e0aa12b0cd2c01651346b',
        contentsCss: 'https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css',
        fontSize_sizes: fontSizes.join('')
      }
    }
  },
  computed: {
    internalName(){
      return this.name || this.$uid()
    },
    //default disk
    mediaDisk() {
      return this.disk || this.$getSetting('media::filesystem');
    }
  },
  methods: {
    init() {
      this.responseValue = this.$clone(this.modelValue)
    },
    //On name space loaded
    onNamespaceLoaded(CKEDITOR) {
      //Load custom plugins
      pluginCollapsibleItem.load(CKEDITOR)
      pluginGrid.load(CKEDITOR);
      pluginEmbed.load(CKEDITOR);
      pluginFa.load(CKEDITOR);
      CKEDITOR.dtd.$removeEmpty['span'] = false;
      console.dir(CKEDITOR)


      CKEDITOR.on('instanceReady', (event) => {
        //this.onBeforeGetData(event)
        this.onPaste(event, CKEDITOR)
      });      
    },
    configModules(name) {
      if (!name) return;
      return Boolean(config(name));
    },
    onBeforeGetData(event){
      event.editor.on('beforeGetData', (event) => {
        console.log('before')
      })

    },
    onPaste(event, ckEditor){
      const editor = event.editor
      editor.on('paste', (event) => {
        const value = event.data.dataValue
        if(value.includes('data:image') || value.includes('src') ){
          const img = event.data.dataValue
          const element = ckEditor.dom.element.createFromHtml(img)
          this.loading = true
          event.data.dataValue = ''
          this.uploadImage(element).then((response) => {
            const src = response.url
            const imgElement = `<img src="${src}"/>`
            const element = ckEditor.dom.element.createFromHtml(imgElement)
            editor.insertElement(element)
            this.loading = false
          })          
        }
      })
    },
   
    //upload files
    async uploadImage(data) {
      /* create a file from base64 data and adds to form*/
      return new Promise((resolve, reject) => {
        fetch(data.$.src)
        .then(res => res.blob())
          .then(blob => {
            let fileData = new FormData();
            fileData.append('parent_id', 0);
            fileData.append('disk', this.mediaDisk);
            const file = new File([blob], "ckeditor.png", { type: 'image/png' });        
            fileData.append('file', file)
          //Request send file
          this.$crud.post('apiRoutes.qmedia.files', fileData).then(response => {
            resolve(response.data)
          }).catch((error) => {
            console.log(error)
            resolve(false)
          });
        })
      })
    }
  }
}
</script>
<style lang="scss">
#ckEditorComponent {
  .btn-content-toolbar {
    background-size: 16px;
    height: 16px;
    width: 16px;
  }

  #iconToolbarCollapsibleitem {
    background-image: url("src/plugins/ckEditorPlugins/collapsibleItem/collapsibleitem.png");
  }

  #iconToolbarGrid {
    background-image: url("src/plugins/ckEditorPlugins/grid/grid.png");
  }

  #iconToolbarEmbed {
    background-image: url("src/plugins/ckEditorPlugins/embed/embed.png");
  }

  .cke_button__ckeditorfa_icon {
    background-image: url("src/plugins/ckEditorPlugins/ckeditorfa-fa6/icons/ckeditorfa.png") !important;
  }
}

/* ckeditor-fa pluging */
#ckeditor-fa-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

#ckeditor-fa-icons {
  text-align: center;
  white-space: normal;
  width: 100%;
  height: 400px;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow: auto;
  background-color: #f0f1f3;
}

#ckeditor-fa-icons button {
  display: inline-block;
  width: 100px;
  padding: 5px;
  text-align: center;
  vertical-align: top;
  background-color: #ffffff;
  border-radius: 4px !important;
  border: 2px solid #f0f1f3 !important;
}

#ckeditor-fa-icons button:hover {
  /* transform: scale(1.2) */
  transition: all 0.1s ease-in-out;
  border: 2px solid $primary !important;
}

#ckeditor-fa-icons button span {
  font-size: 28px;
  display: block;
  text-align: center;
}

#ckeditor-fa-icons button p {
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ckeditor-fa-select {
  display: block !important;
}

</style>
