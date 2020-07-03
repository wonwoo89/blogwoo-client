import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import Home from '../views/Home.vue';

const postComponent = () => import(/* webpackChunkName: "post" */ '../views/Post.vue');
const detailComponent = () => import(/* webpackChunkName: "detail" */'../components/post/Detail.vue');
const editComponent = () => import(/* webpackChunkName: "edit" */ '../components/post/Form.vue');
const etcComponent = () => import(/* webpackChunkName: "etc" */ '../views/Etc.vue');
const publishComponent = () => import(/* webpackChunkName: "publish" */ '../views/Publish.vue');
const walletComponent = () => import(/* webpackChunkName: "wallet" */'../views/Wallet.vue');

Vue.use(VueRouter);
Vue.use(VueMeta);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/post',
    name: 'Post',
    component: postComponent,
    children: [
      {
        path: ':postID',
        name: 'Detail',
        component: detailComponent,
      },
      {
        path: ':postID/edit',
        name: 'Edit',
        meta: {
          editable: true,
        },
        component: editComponent,
      },
    ],
  },
  {
    path: '/etc',
    name: 'Etc',
    component: etcComponent,
  },
  {
    path: '/publish',
    name: 'Publish',
    component: publishComponent,
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: walletComponent,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
});

export default router;
