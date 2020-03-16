import Vue from 'vue';
import router from './router';
import App from './App.vue';

Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
});

// const LandingPage = { template: '<div>landing</div>' };
// const LandingPage = { template: '<h1>Hello</h1>' };
// const RegisterPage = { template: '<div>register</div>' };
// const LoginPage = { template: '<div>login</div>' };

// const routes = [
//   { path: '/', component: LandingPage },
//   { path: '/register', component: RegisterPage },
//   { path: '/login', component: LoginPage },
// ];

// const app = new Vue({
//   router,
// }).$mount('#app');
