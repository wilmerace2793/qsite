/*
export const someGetter = (state) => {}
*/
import {helper} from '@imagina/qhelper/_plugins/helper'


export const getSettings = (state) => {
  return state.settings;
};

export const getAvalaibleLocales = (state) => {
  return state.availableLocales;
};

export const getAvalaibleThemes = (state) => {
  return state.availableThemes;
};

export const getDefaultLocale = (state) => {
  return state.defaultLocale;
};

export const availableLocalesSelect = (state) => {
  return helper.array.select(state.availableLocales, 'iso');
};

export const availableThemesSelect = (state) => {
  return helper.array.select(state.availableThemes, 'name');
};

export const getSettingValueByName = (state) => (filter) => {
  let setting = state.settings.find(setting => setting.name === filter );
  return setting.value;
};
