import baseService from '@imagina/qcrud/_services/baseService.js'
import store from '../index';
import _ from 'lodash'

export default async function updateRevisions(formData: any): Promise<void> {
    try {
        store.loadingModal = true;
        store.modalFieldComparison = true;
        await baseService.update(store.apiRoute, store.revisionableId, formData); 
        store.loadingModal = false;
    } catch (error) {
      console.log(error, 'updateRevisions');
    }
}