export default {
  routes: [
    {
      method: 'POST',
      path: '/orders/checkout',
      handler: 'order.checkout',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/orders/webhook',
      handler: 'order.webhook',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/orders/track',
      handler: 'order.track',
      config: {
        auth: false,
      },
    },
  ],
};
