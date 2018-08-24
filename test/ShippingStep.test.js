import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import TheShippingStep from '../view/frontend/web/js/components/steps/TheShippingStep.vue'
import VeeValidate from 'vee-validate'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VeeValidate)

describe('TheShippingStep.test.js', () => {
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

    wrapper = shallowMount(TheShippingStep, {
      data: () => ({
        customer: {
          email: 'test@test.com',
          emailAvailable: false
        }
      }),
      computed: {
        baseUrl: () => 'http://localhost/',
        step: () => 'shipping',
        shippingMethods: () => []
      },
      store,
      localVue
    })
  })

  // it('commits a setItem (setCustomerEmail) when a button is clicked', () => {
  //   wrapper
  //     .find(`.ddd`)
  //     .trigger('click')

  //   console.log(wrapper.find('.ddd'))
  //   console.log('dddd')
  //   expect(mutations.setItem.mock.calls).toHaveLength(1)
  //   expect(mutations.setItem.mock.calls[0][1]).toEqual({
  //     item: 'setCustomerEmail',
  //     value: 'test@test.com'
  //   })
  // })

  it('has the expected html structure', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
