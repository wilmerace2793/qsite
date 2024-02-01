import Vue from 'vue'
import {createI18n} from 'vue-i18n'
import Quasar from 'quasar'
import * as moment from 'moment'
import cache from '@imagina/qsite/_plugins/cache'
import helper from '@imagina/qsite/_plugins/helper'

// i18n data
import customFormats from '@imagina/qsite/_i18n/master/formats/customFormats'
import numberFormats from '@imagina/qsite/_i18n/master/formats/currencyFormats'
import dateTimeFormats from '@imagina/qsite/_i18n/master/formats/dateTimeFormats'
import messagesLocal from '@imagina/qsite/_i18n/JsonLocal/i18n.json'

export default async ({router, app, Vue, store, ssrContext}) => {
  //Request messages
  const useLocalTranslations = config('app.useLocalTranslations')
  const messagesServer = useLocalTranslations ? {} : await store.dispatch('qtranslationMaster/GET_TRANSLATIONS', {refresh: false})
  let messages = useLocalTranslations ? messagesLocal : messagesServer
  //===== Get default language
  //From URL
  let defaultLanguage = helper.getLocaleRoutePath(ssrContext ? ssrContext.url : window.location.hash)
  //From Cache
  if (!defaultLanguage) defaultLanguage = await cache.get.item('site.default.locale')
  //From VUEX Store or Config APP
  if (!defaultLanguage) defaultLanguage = store.state.qsiteApp.defaultLocale || config('app.languages.default')

  //====== Config i18n and set instance i18n
  i18n = createI18n({
    locale: defaultLanguage,
    fallbackLocale: defaultLanguage,
    formatter: new customFormats(),
    numberFormats,
    dateTimeFormats,
    silentTranslationWarn: true,
    messages
  })
  //===== Change language to quasar components
  await store.dispatch('qsiteApp/SET_LOCALE', {
    locale: defaultLanguage,
    ssrContext: ssrContext,
    vue: app
  })

  //===== Customs short-keys to locales

  //Currency translate
  app.config.globalProperties.$trc = (num, lang) => {
    return i18n.n(num, 'currency', lang)
  }
  //number translate
  app.config.globalProperties.$trn = (num, type) => {
    if (type == 'percent') num /= 100 //Divide Percent
    return type ? i18n.n(num, type) : i18n.n(num)
  }
  //Singular translate
  app.config.globalProperties.$tr = (key, params = {}) => {
    return i18n.tc(key, 1, params)
  }
  //Plural translate
  app.config.globalProperties.$trp = (key, params = {}) => {
    return i18n.tc(key, 2, params)
  }
  //Date translate
  app.config.globalProperties.$trd = (date, params = {type: 'short', fromUTC: false}) => {
    //Transform date from UTC
    if (params.fromUTC) date = moment(date).local().format('YYYY-MM-DD HH:mm:ss')
    //Repsonse
    return i18n.d(moment(date, 'YYYY-MM-DD HH:mm:ss').toDate(), params.type)
  }
  //Date translate
  app.config.globalProperties.$trdT = (date, format = 'MMMM, DD, YYYY HH:mm') => {
    //Transform date from UTC
    return moment(date).format(format);
  }

  //Set i18nn
  app.use(i18n)
}
