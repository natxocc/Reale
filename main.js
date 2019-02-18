import Vue from 'vue'
import App from './App.vue'
import router from './router'
import HighchartsVue from 'highcharts-vue'
import Quasar from 'quasar'
import "../node_modules/ag-grid-community/dist/styles/ag-grid.css"
import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css"
import 'ag-grid-enterprise'
import "./lib/icons.css"
import "./lib/customCSS.css"
import "../node_modules/quasar/dist/quasar.min.css"
Vue.config.productionTip = false
Vue.use(Quasar, {
  config: {
    brand: {
      primary: '#004b9b',
      secondary: '#f0b400',
      accent: '#9C27B0',

      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#ff8000'
    }
  }
})
Vue.use(HighchartsVue);
import locale from"./lang/es"
Quasar.lang.set(locale)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
