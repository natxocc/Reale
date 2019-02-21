const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/recibos/:recibo",
      name: "Recibos",
      component: Recibos
    }
    // {
    // path: '/clientes',
    // name: 'Clientes',
    // component: Clientes
    // },
    // {
    // path: '/polizas/:poliza',
    // name: 'Polizas',
    // component: Polizas
    // },
    // {
    // path: '/usuarios',
    // name: 'Usuarios',
    // component: Usuarios
    // },
    // {
    // path: '/registros',
    // name: 'Registros',
    // component: Registros
    // },
    // {
    // path: '*',
    // name: '404',
    // component: Page404
    // }
  ]
});