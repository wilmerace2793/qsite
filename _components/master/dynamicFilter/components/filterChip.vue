<script setup>
import { defineProps } from 'vue'
defineProps({
    summary: { 
        type: Object, 
        required: true 
    },
    props: {
        type: Object,
        default: () => {
            return {}
        }       
    },
})
</script>
<template>
    <template v-for="(item, itemKey) in summary"  :key="itemKey" >
        <q-chip
            v-if="item.label !== ''"
            class="tw-pr-5 tw-bg-gray-100" 
            text-color="primary"
            v-bind="props"
        >
            <span class="text-weight-bold">{{ item.label }}</span>
            &nbsp;
            <span class="tw-mr-1">{{ item.option }}</span>
        </q-chip>
    </template>
</template>