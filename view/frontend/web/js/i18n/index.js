import messages from '../data/translations.json'

import Vue from 'vue'
import Vuei18n from 'vue-i18n'

Vue.use(Vuei18n)

const i18n = new Vuei18n({
  locale: (window.snowdog.storeLocale) ? window.snowdog.storeLocale : 'en_US',
  fallbackLocale: 'en_US', // Set as deafult lang to avoid missing translations
  messages
})

export default i18n
