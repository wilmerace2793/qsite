
import Vue from 'vue';
export default async function getCountries(refresh = false) {
    try {
        const params = {
            refresh,
            params: {},
        };
        const response = await Vue.prototype.$crud.index(
            "apiRoutes.qlocations.countries",
            params,
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}