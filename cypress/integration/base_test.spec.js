describe('Base Test', () => {
  // Check for simple product in our M2 instance
  it('Is simple product available', () => {
    // Getting bearer token
    cy.request({
      'method': 'POST',
      'url': 'rest/default/V1/integration/admin/token',
      'body': {
        'username': 'admin',
        'password': 'Qweqwe_123'
      }
    })
      .then((response) => {
        // Checking for prodct in store by SKU
        cy.request({
          'method': 'GET',
          // ¯\_(ツ)_/¯ Magento
          'url': '/rest/default/V1/products?searchCriteria%5Bfilter_groups%5D%5B0%5D%5Bfilters%5D%5B0%5D%5Bfield%5D=sku&searchCriteria%5Bfilter_groups%5D%5B0%5D%5Bfilters%5D%5B0%5D%5Bvalue%5D=24-MB01&searchCriteria%5Bfilter_groups%5D%5B0%5D%5Bfilters%5D%5B0%5D%5Bcondition_type%5D=eq',
          'auth': {
            'user': null,
            'password': null,
            'sendImmediately': true,
            'bearer': response.body
          }
        })
          .then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.items).to.have.length(1)
          })
      })
  })

  // Add item to cart
  it('Add item to cart', () => {

  })

  // Proceed to checkout
  it('Is checkout showing', () => {
    cy.visit('/')
  })
})
