import messages from '../data/translations.json'

import Vue from 'vue'
import Vuei18n from 'vue-i18n'

Vue.use(Vuei18n)

const i18n = new Vuei18n({
  locale: 'pl', // add variable from magento with lang code
  messages
})

export default i18n
