<template class="holaaa">
  <div id="recommendationsComponent">
    <!--Setting Crud-->
    <crud v-bind="crudRecomendationParams" @created="getData()" @updated="getData()"
          @deleted="getData()"/>
    <!--Recommendations content-->
    <div class="relative-position" v-if="recomendationName">
      <!--Top Content-->
      <div class="box row justify-between items-center">
        <!--Title-->
        <div class="text-ellipsis text-subtitle1 row items-center">
          <q-icon class="q-mr-sm" size="20px" color="primary" name="fas fa-hat-wizard"/>
          {{ $trp('ui.label.recommendation') }}
        </div>
        <!--Btn to create-->
        <q-btn icon="fas fa-plus" round unelevated size="10px" color="green"
               @click="$refs.recomendations.create()">
          <q-tooltip>{{ $tr('ui.label.add') }}</q-tooltip>
        </q-btn>
      </div>
      <q-separator class="q-my-sm"/>
      <!--Items-->
      <div class="box item q-px-none q-py-md" v-for="item in items" :key="item.id">
        <!--Content-->
        <div class="ellipsis relative-position">
          <div class="text-subtitle2 q-pr-lg">
            <!--Icon-->
            <q-icon size="20px" class="q-mr-sm" color="primary" name="fas fa-magic"/>
            <!--Title-->
            <div class="ellipsis">
              {{ item.title }}
            </div>
            <q-tooltip>{{ item.title }}</q-tooltip>
          </div>
          <!--Button action-->
          <q-btn class="file-card__bottom_actions absolute-right" icon="fas fa-ellipsis-v" unelevated round size="sm"
                 color="blue-grey" flat padding="sm">
            <!---Menu actions-->
            <q-menu anchor="bottom left" self="bottom end">
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup v-for="(action, itemKey) in fileActions" :key="itemKey"
                        @click.native="action.action(item)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon :name="action.icon" class="q-mr-sm" color="blue-grey" size="18px"/>
                      {{ action.label }}
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <!--Line separator-->
        <q-separator class="q-my-xs"/>
        <div class="text-caption text-justify">
          {{ item.description }}
        </div>
      </div>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {
    '$route.name': {
      deep: true,
      handler: function (newValue) {
        this.init()
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
      recomendationName: false,
      items: false
    }
  },
  computed: {
    crudRecomendationParams() {
      return {
        crudData: import('@imagina/qsite/_crud/recomendations'),
        type: "only-create",
        ref: "recomendations",
        customData: {
          formLeft: {name: {value: this.recomendationName}}
        }
      }
    },
    //File Actions
    fileActions() {
      return [
        {
          label: this.$tr('ui.label.edit'),
          icon: 'fas fa-pen',
          color: 'green',
          action: (item) => {
            this.$refs.recomendations.update(item)
          }
        },
        {
          label: this.$tr('ui.label.delete'),
          icon: 'fas fa-trash',
          color: 'red',
          action: (item) => {
            this.$refs.recomendations.delete(item)
          }
        }
      ]
    },

  },
  methods: {
    init() {
      this.resetData()
      this.getData()
    },
    //reset data
    resetData() {
      // Validate recomendation name from route
      if (this.$route.meta.subHeader && this.$route.meta.subHeader.recomendations)
        this.recomendationName = this.$route.meta.subHeader.recomendations.name
      else this.recomendationName = false
      //Reset items
      this.items = false
    },

    getData() {
      return new Promise((resolve, reject) => {
        //validate recomedation name
        if (!this.recomendationName) return reject(false)

        this.loading = true
        //Request Params
        let requestParams = {
          refresh: true,
          params: {
            filter: {name: this.recomendationName}
          }
        }

        //Get recomendation
        this.$crud.index('apiRoutes.qsite.recommendations', requestParams).then(response => {
          this.loading = false
          this.items = response.data
          resolve(response.data)
        }).catch(error => this.loading = false)
      })
    },
  }
}
</script>
<style lang="stylus">
#recommendationsComponent
  padding 30px 20px 30px 8px
  background $custom-accent-color
  height 100%

  .item
    margin-bottom 8px

    .text-subtitle2
      height 31px
      display flex
      align-items center

  .content-avatar
    max-width 45px
    min-width: 45px;
    padding 0

  .box
    min-height auto


</style>
