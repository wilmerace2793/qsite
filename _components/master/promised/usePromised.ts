import { onMounted, ref, computed, watch  } from 'vue';

export default function usePromised(props: any) {
    const isLoading = computed((): boolean => props.isLoading);
    const data: any = ref(null);
    async function getPromise() {
      setTimeout(async () => { 
      const response = await props.promise;
        data.value = response;
      }, 100);
    }
    watch(props, async () => {
        data.value = null;
        await getPromise();
    }, { deep: true });
    onMounted(() => {
        getPromise();
    });

    return {
      isLoading,
      data,
    };
}