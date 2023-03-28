import Vue from 'vue';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default function storeStepWizard() {
  async function getInfoWizard(categoryId:number) {
    try {
      const response = await baseService.show('apiRoutes.qgamification.categories', 
      categoryId, {refresh : true, params : {include:"activities"}});
      return response.data.activities;
    } catch (error) {
      console.log('Error info general');  
    }
  }
  return { getInfoWizard }
}

