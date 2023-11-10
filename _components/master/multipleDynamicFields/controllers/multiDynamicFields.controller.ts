import { ref, computed, onMounted, watch } from "vue";
import reateEmptyObjectFromFields from '../helpers/reateEmptyObjectFromFields'

export default function multipleDynamicFieldsController(props: any, emit: any) {
    const fieldProps = computed(() => props.fieldProps);
    const defaultField = computed(() => props.fieldProps.fields);
    const fields: any = ref([]);

    function add(): void {
        const fieldProps = reateEmptyObjectFromFields(defaultField.value)
        fields.value.push(fieldProps);
    }
    function deleteItem(index: number): void {
        fields.value.splice(index, 1);
    }

    onMounted(() => {
        const fieldProps = reateEmptyObjectFromFields(defaultField.value)
        fields.value.push(fieldProps);
    });
    watch(fields.value, (newField, oldField): void => {
        if(newField) {
            emit("input", fields.value);
        }
    }, { deep: true });
    return {
        fields,
        fieldProps,
        defaultField,
        add,
        deleteItem,
    };
}