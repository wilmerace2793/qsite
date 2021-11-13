<template>
  <div id="organizationFormPage">
    <div class="q-mb-lg text-right">
      <q-btn label="Update Form" unelevated rounded color="pink" @click="updateForm()"/>
    </div>

    <!--Content-->
    <div id="pageContent">
      <!--page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions :title="$tr($route.meta.title)" @refresh="getData(true)"/>
      </div>
      <!--Form-->
      <div class="relative-position">
        <!--dynamic form-->
        <dynamic-form v-model="form" v-if="crudData" :blocks="parseCrudData.form.blocks" form-type="grid"
                      @submit="syncOrganization" :item-id="organization.id"/>
        <!--Inner loading-->
        <inner-loading :visible="loading"/>
      </div>
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
      organization: false,
      crudData: false,
      form: {}
    }
  },
  computed: {
    //Parse crud data
    parseCrudData() {
      let crudData = this.$clone(this.crudData)

      //Parse blocks
      crudData.form.blocks.forEach((block, blockKey) => {
        //Parse block fields
        Object.keys(block.fields).forEach(fieldName => {
          crudData.form.blocks[blockKey].fields[fieldName].fieldItemId = this.organization.id
        })
      })

      //response
      return crudData
    }
  },
  methods: {
    init() {
      this.getData()
    },
    //Get data
    getData(refresh = false) {
      return new Promise(async resolve => {
        this.loading = true
        await Promise.all([
          this.getOrganizationData(refresh),
          this.getCrudData(refresh)
        ])
        this.loading = false
      })
    },
    //get organizations data
    getOrganizationData(refresh = false) {
      return new Promise((resolve, reject) => {
        let organizationId = this.$store.state.quserAuth.organizationId
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            include : 'fields,schedule.workTimes',
            filter: {allTranslations: true}
          }
        }
        //Request
        this.$crud.show('apiRoutes.qsite.organizations', organizationId, requestParams).then(response => {
          this.organization = this.$clone(response.data)
          this.form = this.$clone(response.data)
          resolve(response.data)
        }).catch(error => reject(error))
      })
    },
    //get crud data
    getCrudData(refresh = false) {
      return new Promise((resolve, reject) => {
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {
            filter: {module: 'isite', entity: 'organization'}
          }
        }
        //Request
        this.$crud.index('apiRoutes.qsite.icruds', requestParams).then(response => {
          this.crudData = response.data.length ? response.data[0].projectCrud : false
          resolve(response.data)
        }).catch(error => reject(error))
      })
    },
    //Syn organization data
    syncOrganization() {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Request
        this.$crud.update('apiRoutes.qsite.organizations', this.organization.id, this.form).then(response => {
          this.$alert.info({message: this.$tr('ui.message.recordUpdated')})
          this.loading = false
        }).catch(error => {
          this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
          this.loading = false
        })
      })
    },
    //update form
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
                  title: {
                    value: null,
                    type: 'input',
                    isTranslatable: true,
                    required: true,
                    props: {
                      label: `${this.$tr('ui.form.name')}*`,
                    },
                  },
                  categoryId: {
                    value: null,
                    type: 'treeSelect',
                    required: true,
                    props: {
                      label: `${this.$tr('ui.form.category')}*`,
                    },
                    loadOptions: {
                      apiRoute: 'apiRoutes.qsite.categories'
                    }
                  },
                  description: {
                    value: null,
                    type: 'html',
                    isTranslatable: true,
                    colClass: 'col-12',
                    required: true,
                    props: {
                      label: `${this.$tr('ui.form.description')}*`
                    }
                  },
                }
              },
              {
                title: "media",
                description: "media Block form",
                name: "media",
                fields: {
                  logo: {
                    name: 'mediasSingle',
                    value: {},
                    type: 'media',
                    colClass: 'col-12',
                    props: {
                      label: 'Logo',
                      zone: 'mainimage',
                      entity: "Modules\\Isite\\Entities\\Organization",
                      entityId: null,
                      accept: 'images',
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
                    isTranslatable: true,
                    props: {
                      label: `${this.$tr('ui.form.province')}`
                    },
                    loadOptions: {
                      apiRoute: 'apiRoutes.qlocations.provinces',
                      select: {label: 'name', id: 'id'},
                      requestParams: {filter: {allTranslations: true, country: 48}},
                      filterByQuery: true
                    },
                  },
                  cityId: {
                    value: null,
                    type: 'select',
                    isTranslatable : true,
                    props: {
                      label: `${this.$tr('ui.form.city')}`,
                      readonly: false
                    },
                    loadOptions: {
                      apiRoute: 'apiRoutes.qlocations.cities',
                      select: {label: 'name', id: 'id'},
                      requestParams: {filter: {allTranslations: true, country: 48}},
                      filterByQuery: true
                    },
                  },
                  address: {
                    value: null,
                    type: 'input',
                    colClass: 'col-12',
                    isTranslatable : true,
                    props: {
                      label: `${this.$tr('ui.form.address')}`,
                    },
                  },
                  map: {
                    value: null,
                    type: 'positionMarkerMap',
                    colClass: 'col-12',
                    isTranslatable : true,
                    props: {
                      label: `${this.$tr('ui.label.map')}`
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
                    value: null,
                    type: 'input',
                    isTranslatable : true,
                    props: {
                      label: `${this.$tr('ui.form.email')}`,
                    },
                  },
                  facebook: {
                    value: null,
                    type: 'input',
                    isTranslatable : true,
                    props: {
                      label: `Facebook`
                    },
                  },
                  instagram: {
                    value: null,
                    type: 'input',
                    isTranslatable : true,
                    props: {
                      label: `Instagram`
                    },
                  },
                  youtube: {
                    value: null,
                    type: 'input',
                    isTranslatable : true,
                    props: {
                      label: `Youtube`
                    },
                  },
                  phones: {
                    value: null,
                    type: 'select',
                    colClass: 'col-12',
                    isTranslatable : true,
                    props: {
                      label: 'Phones',
                      useInput: true,
                      useChips: true,
                      multiple: true,
                      hideDropdownIcon: true,
                      hint: 'isite::common.settingHints.phones',
                      newValueMode: 'add-unique'
                    }
                  },
                  whatsapp1: {
                    label: 'Whatsapp #1',
                    isTranslatable : true,
                    children: {
                      callingCode: {
                        value: null,
                        type: 'select',
                        colClass: 'col-6',
                        props: {
                          label: 'isite::common.settings.whatsapp.callingCode',
                        },
                        loadOptions: {
                          apiRoute: 'apiRoutes.qlocations.countries', //apiRoute to request
                          select: {label: 'name', id: 'callingCode'} //Define fields to config select
                        }
                      },
                      number: {
                        value: null,
                        type: 'input',
                        colClass: 'col-6',
                        props: {
                          label: 'isite::common.settings.whatsapp.number',
                          type: 'number'
                        }
                      },
                      message: {
                        value: null,
                        type: 'input',
                        colClass: 'col-12',
                        props: {
                          label: 'isite::common.settings.whatsapp.message'
                        }
                      },
                      label: {
                        value: null,
                        type: 'input',
                        colClass: 'col-6',
                        props: {
                          label: 'isite::common.settings.whatsapp.label'
                        }
                      },
                      iconLabel: {
                        value: null,
                        type: 'input',
                        colClass: 'col-6',
                        props: {
                          label: 'isite::common.settings.whatsapp.icon-label'
                        }
                      },
                    }
                  },
                  whatsapp2: {
                    label: 'Whatsapp #2',
                    isTranslatable : true,
                    children: {
                      callingCode: {
                        value: null,
                        type: 'select',
                        colClass: 'col-6',
                        props: {
                          label: 'isite::common.settings.whatsapp.callingCode',
                        },
                        loadOptions: {
                          apiRoute: 'apiRoutes.qlocations.countries', //apiRoute to request
                          select: {label: 'name', id: 'callingCode'} //Define fields to config select
                        }
                      },
                      number: {
                        value: null,
                        type: 'input',
                        colClass: 'col-6',
                        props: {
                          label: 'isite::common.settings.whatsapp.number',
                          type: 'number'
                        }
                      },
                      message: {
                        value: null,
                        type: 'input',
                        colClass: 'col-12',
                        props: {
                          label: 'isite::common.settings.whatsapp.message'
                        }
                      },
                      label: {
                        value: null,
                        type: 'input',
                        colClass: 'col-6',
                        props: {
                          label: 'isite::common.settings.whatsapp.label'
                        }
                      },
                      iconLabel: {
                        value: null,
                        type: 'input',
                        colClass: 'col-6',
                        props: {
                          label: 'isite::common.settings.whatsapp.icon-label'
                        }
                      },
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
                    value: null,
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
                title: "colors",
                description: "colors Block form",
                name: "colors",
                fields: {
                  colorPrimary: {
                    value: '#420b0b',
                    type: 'inputColor',
                    isTranslatable : true,
                    props: {
                      label: `${this.$tr('ui.form.primaryColor')}*`
                    }
                  },
                  colorSecondary: {
                    value: '#8b2d2d',
                    type: 'inputColor',
                    isTranslatable : true,
                    props: {
                      label: `${this.$tr('ui.form.secondaryColor')}*`
                    }
                  }
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
