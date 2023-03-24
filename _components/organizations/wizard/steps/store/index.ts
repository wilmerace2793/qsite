import Vue from 'vue';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default function storeStepWizard() {
    async function getInfoStep(categoryId:number, stepName: String) {
        try {
          const response = await baseService.show('apiRoutes.qgamification.categories', 
          categoryId, {refresh : true, params : {include:"activities"}});
          const data = response.data.activities;
          return data.find((item) => item.systemName === stepName);
        } catch (error) {
          console.log('Error nfo step');  
        }
    }
    return { getInfoStep }
}

