<template>
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
        
        <div>
            <div class="text-center">
                <p>Fecha:  25-05-2023</p>
                <p class="tw-text-xl tw-text-center">Antes</p>
            </div>
            
            <pre>
                {{ revision.oldValue }}
            </pre>
        </div>
        <div>
            <div class="text-center">
                <p>Fecha:  25-05-2023</p>
                <p class="tw-text-xl tw-text-center">Hoy</p>
            </div>
            <pre>
                {{ revision.newValue }}
            </pre>
        </div>
    </div>
</div></template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import store from '../../store/index'
export default defineComponent({
    setup() {
        const revision = computed(() => store.revision);
        return {revision};
    },
})
</script>

<style scoped></style>