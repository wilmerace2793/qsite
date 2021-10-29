<template>
  <div id="organizationFormPage">
    <div class="q-mb-lg text-right">
      <q-btn label="Update Form" unelevated rounded color="pink" @click="updateForm()"/>
    </div>

    <!--Content-->
    <div id="pageContent" class="relative-position">
      <!--page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions :title="$tr($route.meta.title)" @refresh="getData(true)"/>
      </div>
      <!--dynamic form-->
      <dynamic-form v-model="form" v-if="crudData" :blocks="crudData.form.blocks" form-type="grid"
                    @submit="syncOrganization"/>
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      crudData: false,
      form: {}
    }
  },
  computed: {},
  methods: {
    init() {
      this.getData()
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Requets params
        let requestParams = {
          refresh: refresh,
          filter: {module: 'isite', entity: 'organization'}
        }
        //Request
        this.$crud.index('apiRoutes.qsite.icruds', requestParams).then(response => {
          this.crudData = response.data.length ? response.data[0].projectCrud : false
          //console.warn(this.crudData)
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Syn organization data
    syncOrganization() {
      console.warn(this.form)
    },


    //updtae form
    updateForm() {
      this.loading = true

      let formData = {
        module: "isite",
        entity: "organization",
        mainCrud: {},
        projectCrud: {
          form: {
            blocks: [
              {
                title: "Information",
                description: "information Block form",
                name: "information",
                fields: {
                  name: {
                    value: '',
                    type: 'input',
                    isTranslatable: true,
                    props: {
                      label: `${this.$tr('ui.form.name')}*`,
                      rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                    },
                  },
                  slogan: {
                    value: '',
                    type: 'input',
                    isTranslatable: true,
                    props: {
                      label: `Slogan*`,
                      rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                    },
                  },
                  description: {
                    value: '',
                    type: 'html',
                    isTranslatable: true,
                    colClass: 'col-12',
                    props: {
                      label: `${this.$tr('ui.form.description')}*`,
                      rules: [
                        val => !!val || this.$tr('ui.message.fieldRequired')
                      ],
                    }
                  }
                }
              },
              {
                title: "location",
                description: "location Block form",
                name: "location",
                fields: {
                  provinceId: {
                    value: null,
                    type: 'select',
                    props: {
                      label: `${this.$tr('ui.form.province')}*`
                    },
                    loadOptions: {
                      apiRoute: 'apiRoutes.qlocations.provinces',
                      select: {label: 'name', id: 'id'},
                      requestParams: {filter: {allTranslations: true, country: 48}}
                    },
                  },
                  cityId: {
                    value: null,
                    type: 'select',
                    props: {
                      label: `${this.$tr('ui.form.city')}*`,
                      options: [],
                      readonly: false
                    }
                  },
                  address: {
                    value: '',
                    type: 'input',
                    props: {
                      label: `${this.$tr('ui.form.address')}*`,
                      rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                    },
                  },
                  map: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      label: `${this.$tr('ui.form.urlMap')}`
                    },
                  }
                }
              },
              {
                title: "media",
                description: "media Block form",
                name: "media",
                fields: {
                  favicon: {
                    name: 'mediasSingle',
                    value: {},
                    type: 'media',
                    props: {
                      label: 'Favicon',
                      zone: 'favicon',
                      entity: "Modules\\Marketplace\\Entities\\Store",
                      entityId: 1
                    }
                  },
                  logo: {
                    name: 'mediasSingle',
                    value: {},
                    type: 'media',
                    props: {
                      label: 'Logo',
                      zone: 'mainimage',
                      entity: "Modules\\Marketplace\\Entities\\Store",
                      entityId: 1
                    }
                  },
                  slider: {
                    name: 'mediasMulti',
                    value: {},
                    type: 'media',
                    colClass: 'col-12',
                    props: {
                      multiple: true,
                      label: 'Slider',
                      zone: 'slider',
                      entity: "Modules\\Marketplace\\Entities\\Store",
                      entityId: 1
                    }
                  }
                }
              },
              {
                title: "schedule",
                description: "schedule Block form",
                name: "schedule",
                fields: {
                  schedule: {
                    value: '',
                    type: 'schedulable',
                    colClass: 'col-12',
                    props: {
                      label: `${this.$tr('ui.form.schedule')}*`,
                      rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                    },
                  }
                }
              },
              {
                title: "socialNetworks",
                description: "socialNetworks Block form",
                name: "socialNetworks",
                fields: {
                  email: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      label: `${this.$tr('ui.form.email')}*`,
                      rules: [
                        val => !!val || this.$tr('ui.message.fieldRequired'),
                        val => this.$helper.validateEmail(val) || this.$tr('ui.message.fieldEmail')
                      ],
                    },
                  },
                  facebook: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      label: `Facebook`
                    },
                  },
                  instagram: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      label: `Instagram`
                    },
                  },
                  youtube: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      label: `Youtube`
                    },
                  },
                  whatsapp1: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      unmaskedValue: true,
                      label: `Whatsapp 1`,
                      mask: 'phone'
                    },
                  },
                  whatsapp2: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      unmaskedValue: true,
                      label: `Whatsapp 2`,
                      mask: 'phone'
                    },
                  },
                  phone1: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      unmaskedValue: true,
                      mask: 'phone',
                      label: `${this.$tr('ui.form.phone')} 1`
                    },
                  },
                  phone2: {
                    value: '',
                    type: 'input',
                    isFakeField: true,
                    props: {
                      unmaskedValue: true,
                      mask: 'phone',
                      label: `${this.$tr('ui.form.phone')} 2`
                    },
                  }
                }
              },
              {
                title: "colors",
                description: "colors Block form",
                name: "colors",
                fields: {
                  colorPrimary: {
                    name: 'color_primary',
                    value: null,
                    type: 'inputColor',
                    props: {
                      label: `${this.$tr('ui.form.primaryColor')}*`,
                      rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
                    }
                  },
                  colorSecondary: {
                    name: 'color_secondary',
                    value: null,
                    type: 'inputColor',
                    props: {
                      label: `${this.$tr('ui.form.secondaryColor')}*`,
                      rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
                    }
                  },
                  colorTertiary: {
                    name: 'color_tertiary',
                    value: null,
                    type: 'inputColor',
                    props: {
                      label: `${this.$tr('ui.form.tertiaryColor')}*`,
                      rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
                    }
                  },
                }
              }
            ]
          }
        }
      }

      this.$crud.update('apiRoutes.qsite.icruds', 1, formData).then(response => {
        this.getData(true)
      }).catch(error => this.loading = false)
    }
  }
}
</script>
<style lang="stylus">
</style>
