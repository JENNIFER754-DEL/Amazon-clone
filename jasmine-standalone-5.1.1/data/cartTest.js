import {addToCart, cart, loadFromStorage} from '../../data/cart.js';

describe('test suite: add to cart', () => {
  it('adds an existing product to the cart', () => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
    return JSON.stringify([{        
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 1,
    deliveryOptionId: '1'    
    }]);

   });   
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });
  it('adds a new product to the cart', () => {
   spyOn(localStorage, 'setItem');
   spyOn(localStorage, 'getItem').and.callFake(() => {
    return JSON.stringify([]);

   });   
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });

  // Additional tests below

  it('does not add product with invalid productId', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();
    addToCart(null);
    addToCart('');
    expect(cart.length).toEqual(0);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('adds multiple different products separately', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();
    addToCart('productA');
    addToCart('productB');
    expect(cart.length).toEqual(2);
    expect(cart.some(item => item.productId === 'productA')).toBeTrue();
    expect(cart.some(item => item.productId === 'productB')).toBeTrue();
  });

  it('increments quantity when adding same product multiple times', () => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{ productId: 'productX', quantity: 1, deliveryOptionId: '1' }]);
    });
    loadFromStorage();
    addToCart('productX');
    addToCart('productX');
    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toEqual(3);
  });
})