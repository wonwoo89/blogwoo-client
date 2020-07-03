class AlertPlugin {
  constructor(store) {
    this.store = store;
    this.pushTimer = null;
  }

  install(Vue) {
    Vue.prototype.$alert = this;
  }

  warn(options) {
    this.send({
      message: options.message,
      prevent: options.prevent,
      after: options.method,
    });
  }

  confirm(options) {
    this.send({
      message: options.message,
      prevent: options.prevent,
      confirm: options.method,
    });
  }

  push(options) {
    clearTimeout(this.pushTimer);

    this.send({
      message: options.message,
      isPush: true,
    });

    this.pushTimer = setTimeout(() => this.close(), 3000);
  }

  send(options) {
    this.store.commit('alert', options);
  }

  close() {
    this.send();
  }
}

export default AlertPlugin;
