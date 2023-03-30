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

  async function getCategories() {
    try {
      const response = await baseService.index('apiRoutes.qsite.categories', {refresh : true});
      const categories = response.data.sort((a, b) => a.title.localeCompare(b.title));
      return categories;
    } catch (error) {
      console.log('Error al cargar las categorias');
    }
  }

  async function getCategoriesSearch(text: string) {
    try {
      const params = {
        filter: {
          search: text
        }
      };
      const response = await baseService.index('apiRoutes.qsite.categories', {refresh : true, params});
      const categories = response.data.sort((a, b) => a.title.localeCompare(b.title));
      return categories;
    } catch (error) {
      console.log('Error al cargar las categorias');
    }
  }

  async function getPlans(planBaseId:number){
    try {
      const params = {
        filter: {
          categories: planBaseId,
        },
        include: 'productOptions,optionValues,relatedProducts'
      };
      let response = await baseService.index('apiRoutes.qcommerce.products', {refresh : true, params});
      return response.data;    
    } catch (error) {
      console.log('Error al cargar los planes');
    }
  }


  return { getInfoWizard, getCategories, getCategoriesSearch, getPlans }
}

