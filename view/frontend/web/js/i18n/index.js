import Vue from 'vue'
import Vuei18n from 'vue-i18n'

// Load en-US as default lang
import defaultMessages from '../data/translations-en_US.json'

const storeLocale = (window.snowdog.storeLocale) ? window.snowdog.storeLocale : 'en_US'

Vue.use(Vuei18n)

const i18n = new Vuei18n({
  locale: 'en_US',
  fallbackLocale: 'en_US', // Set as deafult lang to avoid missing translations
  messages: defaultMessages
})

function loadLanguageJson (storeLocale) {
  if (module.hot && storeLocale !== 'en_US') {
    return import(/* webpackMode: "eager" */ `../data/translations-${storeLocale}.json`)
      .then(messages => {
        const languages = { 'en_US': defaultMessages }
        languages[storeLocale] = messages

        return languages
      })
      .catch(() => {
        console.debug('Unable to load translations for this lang - default en_US loaded')
        return { 'en_US': defaultMessages }
      })
  } else {
    return { 'en_US': defaultMessages }
  }
}

export default i18n
