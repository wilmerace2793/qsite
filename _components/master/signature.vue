<template>
  <div id="signatureComponent" class="q-py-sm q-pt-sm full-width">
    <!--Actions-->
    <div id="btn-actions" class="row">
      <!--Clear-->
      <q-btn icon="delete"  size="sm" flat round color="blue-grey-3" @click="clear()"/>
      <!--Undo-->
      <q-btn icon="undo"  size="sm" flat round color="blue-grey-3" @click="undo()"/>
      <!--fullscreen-->
      <q-btn v-if="btnFullscreen" :icon="btnFullscreenIcon"  size="sm" flat round color="blue-grey-3" @click="$emit('fullscreenActionComponent')"/>
    </div>
    <!--Signature component-->
    <div id="vueSiganture">
      <VueSignaturePad ref="signature" :options="options" :width="width" :height="height"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'signature',
    props: {
      value: null,
      width : {default : '100%'},
      height : {default : '150px'},
      emitFile: {type: Boolean, default: false},
      btnFullscreenIcon: null,
      btnFullscreen: false
    },
    watch: {
      value() {
        this.init()
      }
    },
    data() {
      return {
        model: null,
        options: {onBegin: this.onBegin, onEnd: this.onEnd, penColor: '#000000', images: []}
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init() {
        this.model = this.value
        this.options.images = [{src: this.model, x: 0, y: 0}]
      },
      onBegin() {

      },
      onEnd() {
        const {isEmpty, data} = this.$refs.signature.saveSignature();
        this.model = data || null
        this.$emit('input', this.model)
      },
      undo() {
        this.$refs.signature.undoSignature()
        this.onEnd()
      },
      clear() {
        this.$refs.signature.clearSignature()
        this.onEnd()
      }
    }
  };
</script>

<style lang="stylus">
  #signatureComponent
    #vueSiganture
      border 1px solid $grey-5
      padding-bottom 30px
    #btn-actions
      float right
</style>
