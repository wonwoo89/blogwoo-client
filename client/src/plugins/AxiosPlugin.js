import axios from 'axios';

const environment = process.env.NODE_ENV || 'development';

const apiOrigin = {
  production: 'https://api.blogwoo.xyz',
  development: 'http://local.blogwoo.xyz:1025',
};

const baseURL = apiOrigin[environment];

const http = axios.create({
  baseURL,
});
const api = axios.create({
  baseURL: `${baseURL}/api`,
});
const wallet = axios.create({
  baseURL: `${baseURL}/wallet`,
});

export default {
  install(Vue) {
    Vue.prototype.$http = http;
    Vue.prototype.$API = api;
    Vue.prototype.$Wallet = wallet;
  },
  http,
};
