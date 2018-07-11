import { shallowMount } from '@vue/test-utils'
import App from '../view/frontend/web/js/App.vue'

describe('App.test.js', () => {

  it('has the expected html structure', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.element).toMatchSnapshot()
  })
})
