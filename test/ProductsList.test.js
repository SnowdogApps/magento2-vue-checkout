import Vue from 'vue'
import Vuei18n from 'vue-i18n'
import { mount, createLocalVue } from '@vue/test-utils'
import messages from '../view/frontend/web/js/data/translations-en_US.json'
import ProductsList from '../view/frontend/web/js/components/ProductsList.vue'

const localVue = createLocalVue()
localVue.use(Vuei18n)
const i18n = new Vuei18n({
  locale: 'en_US',
  messages
})

Vue.filter('currency', function (price) {
  const pattern = '$%s'
  price = parseFloat(price).toFixed(2)
  return pattern.replace('%s', price)
})

describe('ProductsList.test.js', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ProductsList, {
      computed: {
        products: () => [
          {
            base_discount_amount: '0.0000',
            base_price: '48.0000',
            base_price_incl_tax: '48.0000',
            base_row_total: '48.0000',
            base_row_total_incl_tax: '48.0000',
            base_tax_amount: '0.0000',
            discount_amount: '0.0000',
            discount_percent: '0.0000',
            item_id: '229',
            name: 'Hera Pullover Hoodie',
            options: '[{"value":"Blue","label":"Color"},{"value":"XS","label":"Size"}]',
            price: '48.0000',
            price_incl_tax: '48.0000',
            qty: 1,
            row_total: '48.0000',
            row_total_incl_tax: '48.0000',
            row_total_with_discount: '0.0000',
            tax_amount: '0.0000',
            tax_percent: '0.0000',
            weee_tax_applied: null,
            weee_tax_applied_amount: null
          }
        ],
        step: () => 'shipping'
      },
      localVue,
      i18n
    })
  })

  it('renders a $store.state products list return from computed', () => {
    expect(wrapper.find('.products').contains('.product')).toBe(true)
  })

  it('has the expected html structure', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
