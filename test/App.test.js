import { shallow } from 'vue-test-utils'
import App from '../view/frontend/web/js/App.vue'

describe('App.test.js', () => {
  let cmp

  beforeEach(() => {
    cmp = shallow(App)
  })

  it('has the expected html structure', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
