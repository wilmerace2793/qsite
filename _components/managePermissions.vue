<template>
  <q-card id="componentSelectPermissions" class="no-shadow col-12"
          v-if="$auth.hasAccess('profile.permissions.manage')">
    <!--Header-->
    <q-card-title class="q-py-none bg-grey-2">
      <div class="row justify-between">
        <!--Title-->
        <div class="q-subheading text-primary capitalize">
          <q-icon name="fas fa-check-double"></q-icon>
          {{this.$trp('ui.label.permission')}}
        </div>
        <!--Loading-->
        <q-spinner v-if="loading" color="blue-grey" :size="30"/>
        <div v-else class="q-py-xs">
          <q-btn-toggle
            v-model="toggleButtons.all"
            toggle-color="blue-grey"
            color="white" size="11px"
            @input="togglePermissions(true)"
            text-color="grey-8"
            :options="options.toggle"
          />
          <!--Toogle list-->
          <q-toggle class="q-ml-sm" v-model="toogle"/>
        </div>
      </div>
    </q-card-title>

    <!--Content-->
    <q-collapsible v-if="Object.keys(permissions).length && toogle"
                   header-style="display: none" v-model="toogle">
      <!--List modules-->
      <q-collapsible v-for="(modules,moduleName) in permissions" :key="moduleName"
                     :label="moduleName" icon="fas fa-project-diagram" style="border-bottom: 1px solid whitesmoke">
        <!--Allow all permissions by module-->
        <div class="q-px-sm q-mb-sm text-center">
          <q-btn-toggle
            v-model="toggleButtons[moduleName]"
            toggle-color="blue-grey"
            color="grey-3" size="11px"
            @input="togglePermissions()"
            text-color="grey-8"
            :options="options.toggle"
          />
        </div>
        <!--List entities-->
        <q-collapsible popup v-for="(entity,entityName) in modules" :key="entityName"
                       icon="fas fa-code-branch" :label="entityName">
          <!--Allow all permissions by module-->
          <div class="q-px-sm q-mb-sm text-center">
            <q-btn-toggle
              v-model="toggleButtons[entityName]"
              toggle-color="blue-grey"
              color="grey-3" size="11px"
              @input="togglePermissions()"
              text-color="grey-8"
              :options="options.toggle"
            />
          </div>
          <!--List permissions-->
          <q-list no-border link separator>
            <q-item v-for="(permission,permissionName) in entity"
                    :key="`${entityName}.${permissionName}`"
                    :label="permissionName" class="q-py-sm">
              <!--Title-->
              <q-item-main :label="permissionName"/>
              <!--Actions-->
              <q-item-side right>
                <q-btn-toggle
                  v-model="response[`${entityName}.${permissionName}`]"
                  toggle-color="positive"
                  color="grey-2" size="12px"
                  text-color="grey-8"
                  @input="emitResponse()"
                  :key="`${entityName}.${permissionName}`"
                  :options="options.status"
                />
              </q-item-side>
            </q-item>
          </q-list>
        </q-collapsible>
      </q-collapsible>
    </q-collapsible>
  </q-card>
</template>
<script>
  //Plugins
  import {required} from 'vuelidate/lib/validators'

  export default {
    props: {
      value: {
        type: Object, default: () => {
          return {}
        }
      },
      getAll: {default: false}
    },
    watch: {
      value(){
        this.orderResponse()//order object response of permissions
        this.emitResponse()//Emit response
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
        loading: true,
        allowAll: 0,
        toogle: false,
        permissions: [],
        response: {},
        toggleButtons: {all: 0}
      }
    },
    computed: {
      options() {
        let response = {
          toggle: [
            {label: `${this.$tr('ui.label.allow')} ${this.$tr('ui.label.all')}`, value: true},
            {label: `${this.$tr('ui.label.deny')} ${this.$tr('ui.label.all')}`, value: false}
          ],
          status: [
            {label: this.$tr('ui.label.allow'), value: true},
            {label: this.$tr('ui.label.inherit'), value: 0},
            {label: this.$tr('ui.label.deny'), value: false}
          ]
        }

        //Remove status inherit
        if (!this.getAll) response.status.splice(1, 1);

        return response//Response
      }
    },
    methods: {
      //Init
      async init() {
        await this.getData()//Get permissions
        this.orderResponse()//order object response of permissions
        this.togglePermissions()//Toogle permissions
        this.emitResponse()//Emit response
      },
      //Get data
      getData() {
        return new Promise((resolve, reject) => {
          this.loading = true
          let configName = 'apiRoutes.qsite.permissions'

          //Request
          this.$crud.index(configName, {refresh: false}).then(response => {
            this.permissions = this.$clone(response.data)
            this.loading = false
            resolve(true)
          }).catch(error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
            reject(true)
          })
        })
      },
      //ORder permission response in object
      orderResponse() {
        let response = {}//Response

        //get keys permissions
        Object.keys(this.permissions).forEach(key => {
          let module = this.permissions[key]
          this.$set(this.toggleButtons, key, 0)
          Object.keys(module).forEach(keyGroup => {
            let groupPermission = module[keyGroup]
            this.$set(this.toggleButtons, keyGroup, 0)
            Object.keys(groupPermission).forEach(keyPermission => {
              let namePermission = `${keyGroup}.${keyPermission}`//Get key name of permission
              //get value form prop or set defualt
              let valuePermission = this.value[namePermission] ? this.$clone(this.value[namePermission]) : false
              response[namePermission.toString()] = valuePermission//Add to response
            })
          })
        })

        this.response = this.$clone(response)//Response
      },
      //Togle permissions
      togglePermissions(all = false) {
        //Clone response permissions
        let response = this.$clone(this.response)

        if (all) {//=== Toggle all permissions
          let value = this.$clone(this.toggleButtons.all)//Get value

          //Toggle all permissions value
          if (value !== 0) {
            Object.keys(response).forEach(key => {
              response[key] = value
            })
          }

          this.toggleButtons.all = 0//Reset toggle button
        } else {//=== Toggle by group
          //Get toogle buttons
          let toggles = this.$clone(this.toggleButtons)

          //loop all toggless
          Object.keys(toggles).reverse().forEach(key => {
            let toogleValue = toggles[key]//Get toggle value

            if (toogleValue !== 0) {
              //Get last toggle name to search
              let toogleArray = (key.toLowerCase()).split('.')
              //update permissions values
              Object.keys(response).forEach(key => {
                //find same word bettewn permission name and toggle name
                let arrayPermissionName = key.toLowerCase().split('.')
                let permissionName = arrayPermissionName.slice(0,toogleArray.length).join('.')
                let toogleName = toogleArray.slice(0,toogleArray.length).join('.')

                //if is same set value
                if (toogleName == permissionName) response[arrayPermissionName.join('.')] = toogleValue
              })
            }

            this.toggleButtons[key] = 0//Reset toggle buttons
          })
        }

        this.response = this.$clone(response)//Clone to response
        this.emitResponse()//Emit permissions
      },
      //Emit response
      emitResponse() {
        let response = {}

        //Define as return response
        Object.keys(this.response).forEach(key => {
          let permission = this.$clone(this.response[key])
          if (this.getAll && (permission !== 0)) response[key] = permission
          else if (permission == true) response[key] = permission
        })


        if(JSON.stringify(this.value) != JSON.stringify(response)){
          this.$emit('input', response)//Emit response
        }
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #componentSelectPermissions
    border 1px solid $grey-4
    .q-card-title
      .q-subheading
        line-height 2.5
        max-height 40px
    .q-collapsible
      .q-item-side
        color $primary
    .q-btn-group
      .q-btn
        min-height 24px !important
        height 24px !important
        padding 0px 12px

        .q-btn-inner
          min-height 22px !important
          height 22px !important
          line-height 1

</style>
