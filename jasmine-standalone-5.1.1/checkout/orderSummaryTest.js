import {renderOrderSummary} from '../../scripts/checkout/orderSummary.js';
import * as cartModule from '../../data/cart.js';
import * as productsModule from '../../data/products.js';
import * as deliveryOptionsModule from '../../data/deliveryOptions.js';
import * as paymentSummaryModule from '../../scripts/checkout/paymentSummary.js';

describe('test suite: render order summary', () => {
  it('displays the cart', () => {
    
  });

  let container;
  beforeAll(() => {
    loadProducts(() => {
      done();
    });
  }); 


  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'js-order-summary';
    document.body.appendChild(container);

    spyOnProperty(cartModule, 'cart', 'get').and.returnValue([
      {
        productId: 'prod1',
        quantity: 2,
        deliveryOptionId: 'del1',
      },
      {
        productId: 'prod2',
        quantity: 1,
        deliveryOptionId: 'del2',
      }
    ]);

    spyOn(productsModule, 'getProduct').and.callFake((id) => {
      const products = {
        prod1: { id: 'prod1', name: 'Product 1', priceCents: 1000, image: 'img1.png' },
        prod2: { id: 'prod2', name: 'Product 2', priceCents: 2000, image: 'img2.png' },
      };
      return products[id];
    });

    spyOnProperty(deliveryOptionsModule, 'deliveryOptions', 'get').and.returnValue([
      { id: 'del1', deliveryDays: 2, priceCents: 0 },
      { id: 'del2', deliveryDays: 5, priceCents: 500 }
    ]);

    spyOn(deliveryOptionsModule, 'getDeliveryOption').and.callFake((id) => {
      const options = {
        del1: { id: 'del1', deliveryDays: 2, priceCents: 0 },
        del2: { id: 'del2', deliveryDays: 5, priceCents: 500 },
      };
      return options[id];
    });

    spyOn(cartModule, 'removeFromCart').and.stub();
    spyOn(cartModule, 'updateDeliveryOption').and.stub();

    spyOn(paymentSummaryModule, 'renderPaymentSummary').and.stub();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders multiple cart items with expected HTML structure', () => {
    renderOrderSummary();
    const summaryHTML = container.innerHTML;

    expect(summaryHTML).toContain('Product 1');
    expect(summaryHTML).toContain('Product 2');
    expect(summaryHTML).toContain('Quantity: <span class="quantity-label">2</span>');
    expect(summaryHTML).toContain('Quantity: <span class="quantity-label">1</span>');
    expect(summaryHTML).toContain('$10.00');
    expect(summaryHTML).toContain('$20.00');
    expect(summaryHTML).toContain('FREE');
    expect(summaryHTML).toContain('$5.00');
  });

  it('delete link click calls removeFromCart and updates DOM', () => {
    renderOrderSummary();

    const deleteLinks = container.querySelectorAll('.js-delete-quantity-link');
    expect(deleteLinks.length).toBeGreaterThan(0);

    deleteLinks[0].click();

    expect(cartModule.removeFromCart).toHaveBeenCalledWith('prod1');

    const removedItem = container.querySelector('.js-cart-item-prod1');
    expect(removedItem).toBeNull();

    expect(paymentSummaryModule.renderPaymentSummary).toHaveBeenCalled();
  });

  it('clicking delivery option calls updateDeliveryOption and rerenders', () => {
    renderOrderSummary();

    const deliveryOptions = container.querySelectorAll('.js-delivery-option');
    expect(deliveryOptions.length).toBeGreaterThan(0);

    spyOn(window, 'renderOrderSummary').and.callThrough();

    deliveryOptions[0].click();

    expect(cartModule.updateDeliveryOption).toHaveBeenCalled();
    expect(paymentSummaryModule.renderPaymentSummary).toHaveBeenCalled();
  });
})
