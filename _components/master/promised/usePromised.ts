import { onMounted, ref, computed, watch, WritableComputedRef } from 'vue';
export interface PropsContract {
  isLoading: boolean;
  promise: Promise<void>;
}
export interface UsePromisedContract {
    data: any;
    isLoading: WritableComputedRef<boolean>;
}
/**
 * Returns an object containing `isLoading` and `data` properties which are reactive.
 *
 * @param {boolean} props.isLoading - A boolean indicating if data is being loaded.
 * @param {Promise} props.promise - A promise that will resolve with data.
 * @returns {Object} An object containing reactive `isLoading` and `data` properties.
 */

export default function usePromised(props: PropsContract): UsePromisedContract {
  /**
    * Computed Boolean Reference that indicates if the props are currently loading.
    * @type {WritableComputedRef<boolean>}
  */
  const isLoading: WritableComputedRef<boolean> = computed((): boolean => props.isLoading);
  /**
  * A reactive reference that stores the fetched data.
  * @type {AnyRef}
  */
  const data: any = ref<any>(null);
  /**
  * Function that fetches the required data asynchronously.
  *
  * @returns {Promise<void>} A promise that resolves when the data has been fetched.
  */
  async function getPromise(): Promise<void> {
    setTimeout(async () => {
      const response = await props.promise;
      data.value = response;
    }, 100);
  }
  /**
   * Watches the changes in the props object and refetches the data accordingly.
   *
   * @returns {Promise<void>} A promise that resolves when the data has been refetched.
  */
  watch(props, async (): Promise<void> => {
    data.value = null;
    await getPromise();
  }, { deep: true });
  
  /**
   * Mounted hook that fetches the required data on component mount.
  */
  onMounted((): void  => {
    getPromise();
  });
  /**
   * Object with the data that can be used in the component's template.
   * @type {ReactiveData}
  */
  return {
    isLoading,
    data,
  };
}