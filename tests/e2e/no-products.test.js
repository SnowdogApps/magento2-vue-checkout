import { Selector } from 'testcafe'

fixture (`Checkout page`)
  .page('http://m22.test/checkout/');

test('Test page without products', async t => {
  await t
    .expect(Selector('.cart-empty p').innerText).eql('You have no items in your shopping cart.');
});
