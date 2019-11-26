<template>
  <div id="pageCaptcha">
    <!--Widget V2 Checkbox-->
    <div v-if="key && checkbox" id="g-recaptcha"></div>
    <!--Text V#-->
    <div v-else-if="key" class="text-info-v3" v-html="$tr('ui.message.captcha')"></div>
  </div>
</template>

<script>
  export default {
    name: 'captchaComponent',
    props: {
      case: { default: 'login' },
      checkbox: {
        default: false,
        type: Boolean
      }
    },
    components: {},
    watch: {},
    mounted () {
      this.$nextTick(function () {
        this.init()
      })
    },
    data () {
      return {
        key: null,
        widget: null
      }
    },
    methods: {
      //Init
      init () {
        //Define KEY according to version of recaptcha
        this.key = this.checkbox ?
          this.$store.getters['qsiteSettings/getSettingValueByName']('isite::reCaptchaV2Site') :
          this.$store.getters['qsiteSettings/getSettingValueByName']('isite::reCaptchaV3Site')

        if (this.key) {
          this.addCDNCaptcha()
        }//add cdn
        else {
          this.$emit('input', { token: true })
        }//Emmit true value
      },
      //add CDN captcha
      addCDNCaptcha () {
        let cdnAttributes = this.checkbox ? '' : '?render=' + this.key //attributes according Version of recaptcha
        let recaptcha = document.createElement('script')//create CDN google recaptcha
        recaptcha.setAttribute('src', 'https://www.google.com/recaptcha/api.js' + cdnAttributes)
        recaptcha.onload = this.initCaptcha()//callback when loaded cdn
        document.head.appendChild(recaptcha)//add to head
      },
      //Listen token catpcha and emit token
      initCaptcha () {
        //Set time out to permit success loaded of cdn
        setTimeout(() => {
          if (this.checkbox) {//(V2)
            this.widget = grecaptcha.render('g-recaptcha', {
              sitekey: this.key,
              callback: (token) => {
                this.$emit('input', { version: 2, token: token })
              }
            })
          } else {//(V3)
            grecaptcha.ready(() => {
              this.vEmitTokenV3()
            })
          }
        }, 500)
      },
      //Emit token of version 3
      vEmitTokenV3 () {
        grecaptcha.execute(this.key, { action: this.action }).then(token => {
          this.$emit('input', { version: 3, token: token })
        })
      },
      //Reset captcha
      reset () {
        if (this.key) {
          if (this.checkbox) {
            grecaptcha.reset(this.widget)
          } else {
            this.vEmitTokenV3()
          }
        }
      },
    }
  }
</script>
<style lang="stylus">
  #pageCaptcha
    .text-info-v3
      color $grey-5
      font-size 14px

      a
        color $light-blue-13

  //Hidden badage
  .grecaptcha-badge
    visibility hidden
</style>
