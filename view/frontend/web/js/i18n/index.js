import Vue from 'vue'
import Vuei18n from 'vue-i18n'

import defaultMessages from '../data/translations-en_US.json'
import plMessages from '../data/translations-pl_PL.json'

const storeLocale = window.snowdog.storeLocale

Vue.use(Vuei18n)

export const i18n = new Vuei18n({
  locale: 'en_US',
  fallbackLocale: 'en_US', // Set as deafult lang to avoid missing translations
  messages: {
    en_US: defaultMessages.en_US,
    pl_PL: plMessages.pl_PL
  }
})

function settingLocalCode (localCode) {
  if (localCode === 'en_US') {
    return false
  }

  i18n.locale = localCode
  return localCode
}

settingLocalCode(storeLocale)
