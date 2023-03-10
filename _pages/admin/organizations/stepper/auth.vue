<template>
  <div id="authWizard">
    <!--Page Content-->
    <div class="auth-wrapper">   

      <div class="auth-register border tw-flex tw-mx-auto tw-flex-col">
        <!--Auth Type-->
        <div class="">
            <!--Loggin-->
            <div v-if="true">
                <login-form v-if="authType == 'login'" @logged="checkAfterLogin()" class="full-width"/>
                <!--Register-->
                <register-form v-if="authType == 'register'" @logged="checkAfterLogin()"
                            class="full-width"/>
                <!--Loggin-->
                <reset-password v-if="authType == 'resetPassword'" class="full-width"/>
                <!-- reset password -->
                <reset-password-complete v-if="authType == 'resetPasswordComplete'" class="full-width"/>
                <!-- force change password -->
                <force-change-password v-if="authType == 'forceChangePassword'" class="full-width"/>
            </div>
            <!--logout-->
            <logout v-if="authType == 'logout'" class="full-width"/>
        </div>
        <!--Auth social-->
        <!--<div style="min-height: auto" v-if="withAuthSocial"> -->
        <div style="min-height: auto">
            <q-separator class="tw-my-4"/>
            <!--Actions-->
            <div class="row justify-center q-gutter-sm">
            <google-auth/>
            <facebook-auth/>
            <microsoftAuth @logged="checkAfterLogin()" />
            </div>
        </div>
    </div>
        
      <div class="auth-sidebar text-blue-grey-9">
        <div class="auth-text">  
          <div class="tw-text-xl lg:tw-text-3xl xl:tw-text-4xl tw-px-6 tw-text-center tw-pb-6 tw-font-bold">
            Crea tu cuenta de Wyg <span class="tw--ml-1.5 tw-underline text-decoration-color">o</span>
          </div>
          <div class="tw-text-md xl:tw-text-lg tw-pb-4 tw-text-justify">
            Registra tu cuenta gratis hoy mismo y podrás disfrutar de:
          </div>  

          <q-list dense class="tw-text-md xl:tw-text-lg tw-text-justify">
            <q-item>
              <q-item-section avatar class="tw-min-w-min">
                <q-icon color="primary" name="check" />
              </q-item-section>
              <q-item-section>Tu página web, tu tienda online</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar class="tw-min-w-min">
                <q-icon color="primary" name="check" />
              </q-item-section>
              <q-item-section>Una galería repleta de imágenes libres de derechos</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar class="tw-min-w-min">
                <q-icon color="primary" name="check" />
              </q-item-section>
              <q-item-section>Consejos prácticos sobre cómo gestionar tu negocio</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar class="tw-min-w-min">
                <q-icon color="primary" name="check" />
              </q-item-section>
              <q-item-section>Atención al cliente personalizada de nuestro equipo</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//components
import loginForm from '@imagina/quser/_components/auth/login'
import registerForm from '@imagina/quser/_components/auth/register'
import resetPassword from '@imagina/quser/_components/auth/resetPassword'
import resetPasswordComplete from '@imagina/quser/_components/auth/resetPasswordComplete'
import forceChangePassword from '@imagina/quser/_components/auth/forceChangePassword'
import logout from '@imagina/quser/_components/auth/logout'
import masterModal from '@imagina/qsite/_components/master/masterModal'

import facebookAuth from '@imagina/quser/_components/socialAuth/facebook'
import googleAuth from '@imagina/quser/_components/socialAuth/google'
import microsoftAuth from '@imagina/quser/_components/socialAuth/microsoft'
import axios from "axios"
import moment from "moment";
import momenttz from 'moment-timezone';

export default {
  props: {},
  components: {
    loginForm,
    registerForm, 
    resetPassword,
    forceChangePassword, 
    logout, 
    facebookAuth, 
    googleAuth, 
    resetPasswordComplete,
    microsoftAuth,
    masterModal
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fromVueRoute = from.name || false)
  },
  mounted() {
    this.$nextTick(function () {
      sessionStorage.removeItem('msal.interaction.status');
      sessionStorage.removeItem('socialType');
      this.init()
    })
  },
  data() {
    return {
      fromVueRoute: false,
      appConfig: config('app'),
      authType: 'register',
    }
  },
  computed: {
    //Return auth type
    authType() {
      return this.$route.meta.authType
    },
    //Settings
    settings() {
      //Get auth banner
      let authBanner = this.$store.getters['qsiteApp/getSettingMediaByName']('iprofile::authBanner')

      let response = {
        logo: this.$store.state.qsiteApp.logo,
        authTitle: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::authTitle'),
        hideLogo: parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::hideLogo')),
        authBanner: !authBanner.path || authBanner.path.includes('defaultLogo.jpg') ? false : authBanner
      }

      //response
      return response
    },
    //Validate if load social auth
    withAuthSocial() {
      let hasSetting = parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUsersWithSocialNetworks'))
      return hasSetting/* && (config('app.mode') == 'ipanel'))*/ ? true : false
    },
    microsoftClient() {
      return this.$store.getters['qsiteApp/getSettingValueByName']('isite::microsoftClientId')
    },
    allowLocalLogin() {
      return Boolean(Number(this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::allowLocalLogin')))
    },
  },
  methods: {
    init() {

    },
    checkAfterLogin(){
      //preguntar por setting para validar timeZone
      this.checkTimeZone()
      //else
      this.redirectAfterLogin()
    },
    checkTimeZone(){
      //Modal persistent...
      //si no tiene timezone abre modal - Seleccione timezone - requestAsync put actualizando timeZone
      // check si guardo timezone...
      axios.defaults.params.setting.timezone = moment.tz.guess()
      // redirectAfterLogin
    },
    //Redirect after user be logged
    redirectAfterLogin() {
      //sino hace el resto
      //Get workSapce assigned from user Role. if not found it, set `iadmin` as default
      let windowLastRoute = this.$route.query.redirectTo || false
      let settingsProfile = this.$store.state.quserAuth.settings
      let workSpace = settingsProfile.workSpace || 'iadmin'

      //Redirect to same workSpace
      if (windowLastRoute || (workSpace == config('app.mode'))) this.$router.push({name: 'app.home'})
      //Redirect to assigned workSpace
      else this.$helper.openExternalURL(`${this.$store.state.qsiteApp.baseUrl}/${workSpace}`, false)
    }
  }
}
</script>
<style>
#authWizard .auth-wrapper {
  @apply tw-min-h-screen tw-z-10 tw-flex tw-flex-col tw-justify-center tw-bg-white tw-box-border tw-w-2/4;
  padding: 95px 0 75px;
  transition: transform .4s ease-out, width .4s ease-out;
}  
#authWizard .auth-sidebar {
  @apply tw-py-20 tw-flex tw-justify-center tw-items-center tw-flex-col tw-px-6 xl:tw-px-20 tw-h-full tw-left-1/2 tw-right-0 tw-top-0 tw-fixed;
  contain: strict;
  transition: all .4s ease-out;
  background: -webkit-linear-gradient(right,#fff,#e4e2f2);
  /*tw-bg-indigo-50*/
}
@media only screen and (max-width: 1439px) {
  #authWizard .auth-wrapper {
    width: 700px;
  }
  #authWizard .auth-sidebar {
    @apply tw-left-auto;
    width: calc(100% - 700px);
  }
}
@media only screen and (max-width: 1023px) {
  #authWizard .auth-wrapper {
    @apply tw-w-full tw-pb-24;
  }
  #authWizard .auth-sidebar {
    @apply tw-w-0 tw-p-0;
  }
}         
.text-decoration-color {
  text-decoration-color: var(--q-color-primary);
}
#authWizard .box {
  @apply tw-shadow-none;
}
#authWizard .box-title {
  color: var(--q-color-blue-grey-9);
}
#authWizard .auth-register {
  max-width: 300px;
  -webkit-animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
#authWizard .auth-text {
  -webkit-animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
</style>
