<template>
  <q-card id="componentSelectSettings" class="no-shadow col-12"
          v-if="$auth.hasAccess('profile.permissions.manage')">
    <!--Header-->
    <q-card-title class="no-border q-py-none bg-grey-2">
      <div class="row justify-between">
        <!--Title-->
        <div class="q-subheading text-primary capitalize">
          <q-icon name="fas fa-cogs"></q-icon>
          {{this.$trp('ui.label.setting')}}
        </div>
        <div class="q-py-xs">
          <!--Toogle list-->
          <q-toggle class="q-ml-sm" v-model="toogle"/>
        </div>
      </div>
    </q-card-title>

    <!--Content-->
    <q-collapsible header-style="display: none" v-model="toogle" v-if="success">
      <!--List modules-->
      <q-collapsible v-for="(setting,key) in settings" :key="key" :label="setting.description || key"
                     icon="fas fa-cog" style="border-bottom: 1px solid whitesmoke">
        <!--Field-->
        <dynamic-field :key="key" v-model="response[key].value" :field="setting"
                       @input="emitResponse()"/>
      </q-collapsible>
    </q-collapsible>
  </q-card>
</template>
<script>
  export default {
    props: {
      value : {default : false},
      settings : {default : false}
    },
    components: {},
    watch: {
      value(){
        this.setValues()
      }
    },
    validations() {
      return {}
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        success : false,
        loading: true,
        toogle: false,
        response : {},
        fields : []
      }
    },
    methods: {
      //Init
      async init() {
        this.createDynamicFields()//Create dynamic fields
        this.setValues()//set values from prop value
        this.success = true
      },
      //Create dynamic fields
      createDynamicFields(){
        let fields = {}
        Object.keys(this.settings).forEach(key =>{
          fields[key] = {
            name : key,
            value : this.$clone(this.settings[key].value)
          }
        })
        this.response = this.$clone(fields)
      },
      //Set values from prop value
      setValues(){
        if(this.value && this.value.length){
          let values = this.$clone(this.$helper.convertToFrontField(this.value))
          let response = this.$clone(this.response)
          this.response = Object.assign({},response,values)
        }
        this.emitResponse()//Emit response
      },
      //Emit format repsonse
      emitResponse(){
        let value = this.$clone(this.value)
        let response = this.$clone(this.$helper.convertToBackField(this.response))

        //If is not same, emit
        if(JSON.stringify(value) != JSON.stringify(response)){
          this.$emit('input', response)
        }
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #componentSelectSettings
    border 1px solid $grey-4
    .q-card-title
      .q-subheading
        line-height 2.5
        max-height 40px
    .q-collapsible
      .q-item-side
        color $primary

</style>
