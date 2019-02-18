import Home from './pages/Home.js'
import Recibos from './pages/Recibos.js'
// import Clientes from './pages/Clientes.vue'
// import Polizas from './pages/Polizas.vue'
// import Usuarios from './pages/Usuarios.vue'
// import Registros from './pages/Registros.vue'
// import Page404 from './pages/404.vue'
// import Router from './lib/js/vue-router.min.js'
// Vue.use(Router)
export const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/recibos/:recibo',
      name: 'Recibos',
      component: Recibos
    },
    // {
    //   path: '/clientes',
    //   name: 'Clientes',
    //   component: Clientes
    // },
    // {
    //   path: '/polizas/:poliza',
    //   name: 'Polizas',
    //   component: Polizas
    // },
    // {
    //   path: '/usuarios',
    //   name: 'Usuarios',
    //   component: Usuarios
    // },
    // {
    //   path: '/registros',
    //   name: 'Registros',
    //   component: Registros
    // },
    // {
    //   path: '*',
    //   name: '404',
    //   component: Page404
    // }
  ]
})
