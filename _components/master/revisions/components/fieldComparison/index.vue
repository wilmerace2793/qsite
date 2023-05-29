<template>
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
        <div>
            <div class="text-center">
                <p>Fecha:  25-05-2023</p>
                <p class="tw-text-xl tw-text-center">Antes</p>
            </div>
            <div v-if="revision.oldValue && fields">
                <div v-for="(field, keyField) in fields">
                    <dynamic-field
                        :key="keyField"
                        :id="keyField"
                        :field="field"
                        v-model="revision.oldValue[keyField]"
                    />    
                </div>
            </div>
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
import { defineComponent, computed, inject, ref } from 'vue'
import store from '../../store/index'
export default defineComponent({
    setup() {
        const fields = inject('field', false);
        const revision = computed(() => {
            return store.revision;
        });
        return {revision, fields};
    },
})
</script>

<style scoped></style>