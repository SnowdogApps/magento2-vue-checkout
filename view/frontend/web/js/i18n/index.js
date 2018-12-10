import messages from '../data/translations.json'

import Vue from 'vue'
import Vuei18n from 'vue-i18n'

Vue.use(Vuei18n)

const storeLocale = window.snowdog.storeLocale

const i18n = new Vuei18n({
  locale: storeLocale,
  fallbackLocale: 'en_US', // Set as deafult lang to avoid missing translations
  messages
})

export default i18n
