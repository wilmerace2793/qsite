import {alert} from '@imagina/qhelper/_plugins/alert';
import {helper} from '@imagina/qhelper/_plugins/helper';
import axios from 'axios';
import config from 'src/config/index'
import siteSettings from '@imagina/qsite/_services/index'


export const GET_SITE_SETTINGS = ({commit, dispatch}) => {
	return new Promise((resolve, reject) => {
		let configName = 'apiRoutes.site.siteSettings'
    siteSettings.crud.index(configName).then(response => {
    	let data = response.data
      commit('SET_SITE_SETTINGS', data.siteSettings)
      commit('SET_AVAILABLE_LOCALES', data.availableLocales)
			commit('SET_SELECTED_LOCALES')
			commit('SET_DEFAULT_LOCALE', data.defaultLocale)
			commit('SET_AVAILABLE_THEMES', data.availableThemes)
			resolve(true)
		}).catch(error => {
			console.error('Error Store getting site settings', error)
			reject(error)
		})
	})
}
