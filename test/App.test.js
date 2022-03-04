import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import App from '../view/frontend/web/js/App.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('App.test.js', () => {
  let store
  let actions
  let wrapper

  beforeEach(() => {
    actions = {
      getCustomerData: jest.fn()
    }
    store = new Vuex.Store({
      actions
    })

    wrapper = shallowMount(App, {
      computed: {
        isCustomerLoggedIn: () => true
      },
      store,
      localVue
    })
  })

  it('has the expected html structure', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
