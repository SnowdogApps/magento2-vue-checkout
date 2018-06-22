import { shallowMount } from '@vue/test-utils'
import App from '../view/frontend/web/js/App.vue'

describe('App.test.js', () => {
  let cmp

  beforeEach(() => {
    cmp = shallowMount(App)
  })

  it('has the expected html structure', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
