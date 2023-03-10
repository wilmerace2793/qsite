<template>
  <div id="wizardOrganization" class="tw-h-screen tw-overflow-auto">
    <div class="page-header
                tw-border-b-2 tw-border-white tw-border-opacity-50
                tw-fixed
                tw-top-0
                tw-left-0
                tw-z-20
                tw-flex tw-justify-center tw-items-center
                tw-w-full
                tw-h-16
    ">
      <img :src="logo" class="tw-h-10 tw-w-auto" />
    </div>
    <div class="page-register" v-if="register">
      
      <q-btn color="white" @click="viewWizard()" text-color="black" label="Wizard" />
      <auth></auth>
                    
    </div>
    <div class="page-wizard tw-w-full tw-relative" v-if="wizard">
      <stepper></stepper>
    </div>
  </div>
</template>
<script>
import auth from "@imagina/qsite/_pages/admin/organizations/stepper/auth.vue";
import stepper from "@imagina/qsite/_pages/admin/organizations/stepper/index.vue";

export default {
  beforeDestroy() {
  },
  props: {},
  components: {
    auth,
    stepper
  },
  watch: {},
  computed: {},
  data() {
    return {
      loading: false,
      data: [],
      logo: this.$store.state.qsiteApp.logo,
      register: false,
      wizard: true,
    }
  },
  mounted() {},
  methods: {
    init() {
      //this.getData()
    },
    viewWizard() {
      this.register = false;
      this.wizard= true;
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Requets params
        let requestParams = {
          refresh: refresh
        }
        //Request
        this.$crud.index('apiRoutes', requestParams).then(response => {
          this.data = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
  }
}
</script>
<style>
#wizardOrganization {
  -webkit-overflow-scrolling: touch;
  -webkit-font-smoothing: antialiased;
}
#wizardOrganization .page-header {
  @apply tw-bg-white;
  transition: all .4s ease-out;
  box-shadow: 0 0 6px -2px #8d8d8d;
}
#wizardOrganization .card-terms .q-btn .q-icon {
  @apply tw-text-sm;
}
@-webkit-keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
            transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}
@keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
            transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}

@-webkit-keyframes text-focus-in {
  0% {
    -webkit-filter: blur(12px);
            filter: blur(12px);
    opacity: 0;
  }
  100% {
    -webkit-filter: blur(0px);
            filter: blur(0px);
    opacity: 1;
  }
}
@keyframes text-focus-in {
  0% {
    -webkit-filter: blur(12px);
            filter: blur(12px);
    opacity: 0;
  }
  100% {
    -webkit-filter: blur(0px);
            filter: blur(0px);
    opacity: 1;
  }
}
</style>
