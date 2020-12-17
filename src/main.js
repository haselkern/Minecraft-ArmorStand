import Vue from "vue";
import App from "./App.vue";
import * as VueThreejs from "vue-threejs";
import "./assets/tailwind.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.css";

Vue.use(VueThreejs);

new Vue({
  render: h => h(App),
}).$mount('#app');
