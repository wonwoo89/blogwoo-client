export default {
  install(Vue) {
    Vue.prototype.$setKey = this.setKey;
  },
  setKey(value) {
    return JSON.stringify(value);
  },
};
