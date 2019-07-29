import alert from '@imagina/qhelper/_plugins/alert';
import {helper} from '@imagina/qhelper/_plugins/helper';
import axios from 'axios';
import config from 'src/config/index'
import siteSettings from '@imagina/qsite/_services/index'
import {colors, AddressbarColor} from "quasar"
import Quasar from 'quasar'

export const GET_SITE_SETTINGS = ({commit, dispatch}, vue) => {
  return new Promise((resolve, reject) => {
    let configName = 'apiRoutes.qsite.siteSettings'
    siteSettings.crud.index(configName).then(async response => {
      let data = response.data
      commit('SET_SITE_SETTINGS', data.siteSettings)
      commit('SET_AVAILABLE_LOCALES', data.availableLocales)
      commit('SET_AVAILABLE_THEMES', data.availableThemes)
      commit('SET_DEFAULT_LOCALE', data.defaultLocale)
      commit('SET_SELECTED_LOCALES')
      await dispatch('SET_LOCALE',{locale : false, vue : vue})

      let settings = data.siteSettings;
      let dataColors = {};
      for (let i in settings) {
        let name = settings[i].name.split('::')
        dataColors[name[1]] = settings[i].path ? settings[i].path : settings[i].plainValue
      }
      if (dataColors.brandPrimary) {
        AddressbarColor.set(dataColors.brandPrimary)
        colors.setBrand('primary', dataColors.brandPrimary);
      } else
        colors.setBrand('primary', "#027be3");


      if (dataColors.brandSecondary)
        colors.setBrand('secondary', dataColors.brandSecondary);
      else
        colors.setBrand('secondary', "#26a69a");

      if (dataColors.brandWarning)
        colors.setBrand('warning', dataColors.brandWarning);
      else
        colors.setBrand('warning', "#f2c037");

      if (dataColors.brandLight)
        colors.setBrand('light', dataColors.brandLight);
      else
        colors.setBrand('light', "#bdbdbd");

      if (dataColors.brandDark)
        colors.setBrand('dark', dataColors.brandDark);
      else
        colors.setBrand('dark', "#424242");

      if (dataColors.brandInfo)
        colors.setBrand('info', dataColors.brandInfo);
      else
        colors.setBrand('info', "#31ccec");

      if (dataColors.brandFaded)
        colors.setBrand('faded', dataColors.brandFaded);
      else
        colors.setBrand('faded', "#777");

      if (dataColors.brandPositive)
        colors.setBrand('positive', dataColors.brandPositive);
      else
        colors.setBrand('positive', "#21ba45");

      if (dataColors.brandNegative)
        colors.setBrand('negative', dataColors.brandNegative);
      else
        colors.setBrand('negative', "#db2828");

      if (dataColors.brandTertiary)
        colors.setBrand('tertiary', dataColors.brandTertiary);
      else
        colors.setBrand('tertiary', "#555");

      resolve(true)
    }).catch(error => {
      console.error('Error Store getting site settings', error)
      reject(error)
    })
  })
}

export const SET_LOCALE = ({commit, dispatch, state}, params = {locale : false, vue : false}) => {
  return new Promise(async resolve => {
    let locale = params.locale
    let Vue = params.vue

    //find locale in sotrage, store or first from selected locales
    if (!locale) {
      locale = await helper.storage.get.item('site.default.locale')
      if (!locale) locale = state.defaultLocale
      if (!locale && state.selectedLocales.length) locale = state.selectedLocales[0]
    }
    //Set in storage
    await helper.storage.set('site.default.locale', locale)
    //Set in store
    commit('SET_DEFAULT_LOCALE', locale)
    //Set in axios how default params
    axios.defaults.params.setting['locale'] = locale
    //Set lang to i18n and quasar i18n
    locale = (locale == 'en') ? 'en-us' : locale.toLowerCase()
    import(`quasar-framework/i18n/${locale}`).then(lang => {
      Quasar.i18n.set(lang.default)
    })
    import(`src/i18n/index`).then(({default: messages}) => {
      Vue.$i18n.locale = locale
      Vue.$i18n.setLocaleMessage(locale, messages[locale])
    })
    resolve(true)
  })
}
