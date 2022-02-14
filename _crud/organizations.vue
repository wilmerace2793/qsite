<template></template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qsite.organizations',
        permission: 'isite.organizations',
        create: false,
        read: {
          showAs: 'grid',
          allowToggleView: false,
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title'},
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'center'
            },
          ],
        },
        update: {
          to: 'qsite.admin.organizations.update'
        },
        delete: true,
        formLeft: {},
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
