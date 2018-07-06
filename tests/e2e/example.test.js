import { Selector } from 'testcafe';

let productSampleData = {
  product: 7
};

fixture (`Index page`)
  .page('http://m22.test/checkout/')
  .beforeEach( async t => {
    const formKey = await Selector('input[name=form_key]').value;

    productSampleData['form_key'] = formKey;

    await fetch('http://m22.test/checkout/cart/add/', {
      method: 'POST',
      body: JSON.stringify(productSampleData), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response));
    debugger;
  });

test('add first product on home page', async t => {
  const firstButtonAddToCart = Selector('button.tocart');
  await t
    .click(firstButtonAddToCart)
    .expect(Selector('.counter-number').innerText).eql('1');
});

