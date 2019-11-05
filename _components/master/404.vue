<template>
  <div id="notFoundComponent" class="text-center">
    <q-icon name="power_off" color="grey-7" size="100px"/>
    <p class="text-faded">{{label}}<strong>(404)</strong></p>
    <q-btn color="primary" style="width:200px;" @click="$router.push({name : routeName})"
           v-if="showButton" :label="buttonLabel"/>
  </div>
</template>

<script>
  export default {
    name: 'Error404',
    props: {
      showButton: {default: true},
      routeName: {default: 'app.home'},
      label: {
        default: () => {
          return `${this.$tr('ui.message.notFound')}...`
        }
      },
      buttonLabel: {
        default: () => {
          return this.$tr('ui.message.goToHome')
        }
      },
    }
  }
</script>

<style lang="stylus">
</style>
