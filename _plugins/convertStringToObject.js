
import Vue from "vue";
export default async function convertStringToObject() {
    try {
      let url = "";
      const origin = window.location.href.split("?");
      if (origin.length === 2) {
        url = origin[1] || "";
      }
      if (url.length > 0) {
        const regex = /=/g;
        const regex2 = /&/g;
        const remplaceFilter = url.replace(regex, ":").replace(regex2, ",");
        const remplaceObject = eval("({" + remplaceFilter + "})");
        Object.keys(remplaceObject).forEach((key) => {
          if (Vue.prototype.$filter.fields.hasOwnProperty(key)) {
            remplaceObject[key] = String(remplaceObject[key]);
          }
        });
        return remplaceObject || {};
      }
      return {};
    } catch (error) {
      Vue.prototype.$alert.error('The filter url is misspelled');
      console.log(error);
    }
}