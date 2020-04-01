import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '@/components/LandingPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import LoginPage from '@/components/LoginPage.vue';
import AuctionPage from '@/components/AuctionPage.vue';
import ItemPage from '@/components/ItemPage.vue';


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
    },
    {
      path: '/register',
      name: 'RegisterPage',
      component: RegisterPage,
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/auction',
      name: 'AuctionPage',
      component: AuctionPage,
    },
    {
      path: '/auction/item',
      name: 'ItemPage',
      component: ItemPage,
    },
  ],
});
