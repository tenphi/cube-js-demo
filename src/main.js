import { routing } from 'numl';
import VueApexCharts from 'vue-apexcharts';
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

Vue.config.productionTip = false;

routing.setRouter((url, openNewTab) => {
  // skip outside links and links that open in new tabs
  if (openNewTab || url.startsWith('https://') || url.includes('//') || url.startsWith('mailto:') || url.includes('/api/')) {
    return true;
  }

  router.push(url);

  return false;
});

Vue.config.ignoredElements = [/^nu-/];

Vue.component('apexchart', VueApexCharts);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
