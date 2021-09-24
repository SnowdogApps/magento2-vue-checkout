import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import App from '../view/frontend/web/js/App.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('App.test.js', () => {
  let store
  let mutations
  let wrapper

  beforeEach(() => {
    mutations = {
      setItem: jest.fn()
    }
    store = new Vuex.Store({
      mutations
    })

    wrapper = shallowMount(App, {
      computed: {
        isCustomerLoggedIn: () => true,
        customerData: () => null
      },
      store,
      localVue
    })
  })

  it('has the expected html structure', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
