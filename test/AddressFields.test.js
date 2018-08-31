import { shallowMount, createLocalVue } from '@vue/test-utils'
import AddressFields from '../view/frontend/web/js/components/AddressFields.vue'
import VeeValidate from 'vee-validate'

const localVue = createLocalVue()
localVue.use(VeeValidate)

describe('AddressFields.test.js', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AddressFields, {
      propsData: {
        type: 'shippingAddress'
      },
      computed: {
        addressData: () => {
          return {
            city: 'Arizona',
            company: 'Cafe',
            country_id: {
              is_region_visible: true,
              label: 'United States',
              value: 'US',
            },
            firstname: 'John',
            lastname: 'Lennon',
            postcode: '12312',
            region: 'Arizona',
            region_id: {
              country_id: 'US',
              label: 'Arizona',
              title: 'Arizona',
              value: '4'
            },
            street0: 'Sample Street',
            street1: '2',
            telephone: '123123123',
          }
        },
        regions: () => {
          return [
            {
              country_id: 'US',
              label: 'Arizona',
              title: 'Arizona',
              value: '4'
            }
          ]
        }
      },
      localVue
    })
  })

  it('has the expected html structure', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
