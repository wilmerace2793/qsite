export const RESET = (state) => {
  state.settings = []
  state.availableLocales = []
  state.availableThemes = []
  state.selectedLocales = []
};

//Set settings and set selected locales
export function SET_SITE_SETTINGS(state, data) {
  state.settings = data//Add setting state
}

export function SET_AVAILABLE_LOCALES(state, data) {
  state.availableLocales = data
}

export function SET_AVAILABLE_THEMES(state, data) {
  state.availableThemes = data
}

export function SET_SELECTED_LOCALES(state) {
  //Search locale settigns
  let locales = state.settings.find(item => item.name == 'core::locales')
  locales = locales ? locales.value : []
  //Set locales to state
  state.selectedLocales = locales
}

export function SET_DEFAULT_LOCALE(state, data) {
  state.defaultLocale = data
}


