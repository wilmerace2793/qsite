<template>
    <div class="bg-blue-grey-10 offline-alert" id="offline-alert" @click="$eventBus.$emit('toggleMasterDrawer', 'offline')">
        <q-icon size="16px" name="fa-regular fa-wifi-slash" class="q-mr-sm" /> {{ $tr('isite.cms.message.appOffline') }}
    </div>
</template>

<script>
export default {
    name: "offlineAlert"
}
</script>

<style lang="stylus">
    .offline-alert
        padding: 5px;
        text-align: center;
        color: #FFFFFF;
        @media(min-width: 1024px){
            border-radius: 10px 0 0 0;
        }
        
    
</style>