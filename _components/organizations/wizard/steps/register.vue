<template>
  <div class="step-register">
    <h2 class="step-title-1">{{stepContent.title}}</h2>
    
    <div class="auth-register tw-flex tw-mx-auto tw-flex-col">
        <!--Auth Type-->
        <div class="auth-register-internal">
            <!--Register-->
            <register-form @logged="checkAfterLogin()" class="full-width"/>
        </div>
        <!--Auth social-->
        <div class="auth-register-social h-auto" v-if="withAuthSocial"> 
            <q-separator class="tw-mb-6"/>
            <!--Actions-->
            <div class="row justify-center q-gutter-sm">
              <google-auth />
              <facebook-auth />
              <!-- <microsoftAuth @logged="checkAfterLogin()" />-->
            </div>
        </div>
    </div>
    
    <div class="step-sidebar ">
      <div class="step-register-text">  
        
          <div class="tw-text-xl lg:tw-text-3xl xl:tw-text-4xl tw-px-6 tw-text-center tw-pb-6 tw-font-bold">
            Crea tu cuenta de Wygo 
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
</template>
<script>
import registerForm from '@imagina/quser/_components/auth/register'
import facebookAuth from '@imagina/quser/_components/socialAuth/facebook'
import googleAuth from '@imagina/quser/_components/socialAuth/google'
import microsoftAuth from '@imagina/quser/_components/socialAuth/microsoft'
import axios from "axios"
import moment from "moment";
import momenttz from 'moment-timezone';

export default {
  components: {
    registerForm, 
    facebookAuth, 
    googleAuth, 
    microsoftAuth,
  },
  data() {
    return {
      withAuthSocial: true,
      stepContent: {
        title: '',
        summary: '',
        image: '',
      }
    }
  },
  methods: {
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
      this.$emit("update", { active: true });
    }
  }
}
</script>
<style>
.step-register .step-register-text {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.step-register .box {
  @apply tw-shadow-none;
}
.step-register .box-title {
  color: var(--q-color-blue-grey-9);
}
.step-register .auth-register {
  max-width: 300px;
}
.step-register .auth-register .q-stepper__content  {
  width: auto !important;
  min-height: auto !important;
  display: contents;
}
#formContent + .text-center.full-width {
  display: none;
}
</style>