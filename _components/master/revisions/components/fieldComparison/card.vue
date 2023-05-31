<script lang="ts">
import Vue, { defineComponent, computed } from 'vue'
import store from "../../store/index";

export default defineComponent({
    props: {
        revision: {
            type: Object,
            default: {}
        },
        label: {
            type: String,
            default: '' 
        }
    },
    setup (props) {
        const fields = computed(() => store.fields);
        const revision = computed(() => props.revision);
        const tr = computed(() => Vue.prototype.$tr);
        const trd = computed(() => Vue.prototype.$trd)
        const label = computed(() => props.label);
        return {
            fields,
            revision,
            tr,
            trd, 
            label
        }
    }
})
</script>
<template>
    <div class="tw-p-4 tw-border tw-border-gray-200 tw-rounded-md">
            <div class="text-center">
                <p>{{ tr('isite.cms.label.date') }}:  
                    <span v-if="revision.createdAt">
                        {{trd(revision.createdAt)}}
                    </span>
                </p>
                <p class="tw-text-xl tw-text-center">{{ tr(label) }}</p>
            </div>
            <div>
                <div v-for="(field, keyField) in fields">
                    <dynamic-field
                        class="tw-my-3"
                        :key="keyField"
                        :id="keyField"
                        :field="field"
                        v-model="revision[keyField]"
                    />    
                </div>
            </div>
        </div>
</template>

<style scoped>

</style>