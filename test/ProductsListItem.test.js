import { mount } from '@vue/test-utils'
import ProductsListItem from '../view/frontend/web/js/components/ProductsListItem.vue'

describe('ProductsListItem.test.js', () => {

  it('has received [] as the products property', () => {
    const wrapper = mount(ProductsListItem, {
      // Beaware that props is overriden using `propsData`
      propsData: {
        product: {
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
      }
    })

    // expect(cmp.vm.products).toEqual([])
    // expect(wrapper.is('div')).toBe(true)
    expect(wrapper.element).toMatchSnapshot()
  })
})
