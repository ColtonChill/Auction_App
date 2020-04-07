import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '@/components/LandingPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import LoginPage from '@/components/LoginPage.vue';
import AuctionPage from '@/components/AuctionPage.vue';
import ItemPage from '@/components/ItemPage.vue';
import ItemWinner from '@/components/ItemWinner.vue';
import BidderCommitment from '@/components/BidderCommitment.vue';
// import AdminItemsPage from '@components/AdminItemsPage.vue';
// import AdminPage from '@components/AdminPage.vue';
// import AdminPermissionsPage from '@components/AdminPermissionsPage.vue';
// import AdminSettingsPage from '@components/AdminSettingsPage.vue';
// import ResultsPage from '@components/ResultsPage.vue';


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
      path: '/auction/:auctionName',
      name: 'AuctionPage',
      component: AuctionPage,
      children: [
        {
          path: 'items/',
          children: [
            {
              path: ':itemId',
              component: ItemPage,
            },
          ],
        },
        // {
        //   path: 'admin',
        //   component: AdminPage,
        //   children: [
        //     {
        //       path: 'items',
        //       component: AdminItemsPage,
        //     },
        //     {
        //       path: 'permissions',
        //       component: AdminPermissionsPage,
        //     },
        //     {
        //       path: 'settings',
        //       component: AdminSettingsPage,
        //     },
        //     {
        //       path: 'results',
        //       component: ResultsPage,
        //     }
        //   ]
        // }
      ],
    },
    // {
    //   path: '/auction/:auctionName/items/:itemId',
    //   name: 'ItemPage',
    //   component: ItemPage,
    // },
    // {
    //   path: '/results',
    //   name: 'ItemWinner',
    //   component: ItemWinner,
    // },
    // {
    //   path: '/commitment',
    //   name: 'BidderCommitment',
    //   component: BidderCommitment,
    // },
  ],
});
