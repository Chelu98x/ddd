const base = 'http://localhost:3000/api';

(async () => {
  const email = 'buyer' + Date.now() + '@example.com';
  const phone = String(Date.now()).slice(-10);

  const registerRes = await fetch(base + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: 'Buyer Test',
      userEmail: email,
      userPhoneNumber: phone,
      userPassword: '123456'
    })
  });
  const registerText = await registerRes.text();
  console.log('REGISTER', registerRes.status, registerText);

  const loginRes = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: email, userPassword: '123456' })
  });
  const loginText = await loginRes.text();
  console.log('LOGIN', loginRes.status, loginText);

  const loginData = JSON.parse(loginText);
  const token = loginData.token;

  const productsRes = await fetch(base + '/globals/products');
  const productsText = await productsRes.text();
  console.log('PRODUCTS', productsRes.status, productsText.slice(0, 220));

  const products = JSON.parse(productsText).data || [];
  const product = products[0];
  if (!product) throw new Error('NO_PRODUCTS');

  const addRes = await fetch(base + '/user/cart/add/' + product._id, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token }
  });
  const addText = await addRes.text();
  console.log('ADD_CART', addRes.status, addText);

  const cartRes = await fetch(base + '/user/cart', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const cartText = await cartRes.text();
  console.log('CART', cartRes.status, cartText);

  const orderRes = await fetch(base + '/user/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      orderItems: [{ productId: product._id, quantity: 1 }],
      totalAmount: Number(product.productPrice || 0),
      shippingAddress: 'Test address',
      paymentDetails: { method: 'Cash on Delivery' }
    })
  });
  const orderText = await orderRes.text();
  console.log('ORDER', orderRes.status, orderText);
})();
