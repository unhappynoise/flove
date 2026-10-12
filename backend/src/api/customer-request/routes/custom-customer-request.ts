export default {
  routes: [
    {
      method: 'POST',
      path: '/customer-requests/submit',
      handler: 'customer-request.submit',
      config: {
        auth: false,
      },
    },
  ],
};
