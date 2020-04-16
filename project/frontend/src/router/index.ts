import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '@/components/LandingPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import LoginPage from '@/components/LoginPage.vue';
import AddItem from '@/components/AddItem.vue';
import AuctionPage from '@/components/AuctionPage.vue';
import ItemPage from '@/components/ItemPage.vue';
import EditItem from '@/components/EditItem.vue';
import Dashboard from '@/components/AuctionDashboard.vue';
// import ItemWinner from '@/components/ItemWinner.vue';
// import BidderCommitment from '@/components/BidderCommitment.vue';
import AuctionContainer from '@/components/AuctionContainer.vue';
import JoinPage from '@/components/JoinPage.vue';
import ProfilePage from '@/components/ProfilePage.vue';
import CreateAuctionPage from '@/components/CreateAuctionPage.vue';
import BrowsePublicPage from '@/components/BrowsePublicPage.vue';
import NotFound from '@/components/404.vue';
// import AdminItemsPage from '@components/AdminItemsPage.vue';
import AdminPage from '@/components/AdminPage.vue';
// import AdminPermissionsPage from '@components/AdminPermissionsPage.vue';
// import AdminSettingsPage from '@components/AdminSettingsPage.vue';
// import ResultsPage from '@components/ResultsPage.vue';

Vue.use(Router);

// @ts-ignore
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
      path: '/profile',
      name: 'ProfilePage',
      component: ProfilePage,
    },
    {
      path: '/create-auction',
      name: 'CreateAuctionPage',
      component: CreateAuctionPage,
    },
    {
      path: '/browse',
      name: 'BrowsePublicPage',
      component: BrowsePublicPage,
    },
    {
      path: '/auctions/:auctionUrl',
      component: AuctionContainer,
      children: [
        {
          path: '',
          name: 'AuctionHome',
          component: AuctionPage,
        },
        {
          path: 'addItem',
          name: 'AddItem',
          component: AddItem,
        },
        {
          path: 'items/:itemId',
          name: 'ItemPage',
          component: ItemPage,
        },
        {
          path: 'edit-item/:itemId',
          name: 'EditItem',
          component: EditItem,
        },
        {
          name: 'JoinPage',
          path: 'join',
          component: JoinPage,
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'admin',
          name: 'AdminPage',
          component: AdminPage,
        },
      ],
    },
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
    {
      path: '/404',
      component: NotFound,
      name: '404',
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
});
