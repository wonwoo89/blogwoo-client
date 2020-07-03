<template>
  <div id="alert">
    <div v-if="alert && !push" class="background"></div>
    <transition name="alert">
      <div v-if="alert" class="alert" :class="push && 'push'">
        <div class="box">
          <div class="message">
            <span class="text font black s16">{{message}}</span>
          </div>
        </div>
        <div v-if="!push" class="box btn-wrapper">
          <div class="btn-group" :class="confirm ? 'w2' : ''">
            <button v-if="confirm"
                    type="button"
                    class="btn btn-cancel"
                    @click="cancel">
              <span class="text font s18 black">Cancel</span>
            </button>
            <button type="button"
                    class="btn btn-default btn-ok"
                    @click="ok">
              <span class="text font s18">OK</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'alert',
  watch: {
    alert(alert) {
      if (alert) {
        this.disableFocus();
        this.addKeyEvent();
      } else {
        this.removeKeyEvent();
      }
    },
    prevent(run) {
      if (run) {
        this.prevent();
      }
    },
  },
  computed: {
    ...mapState([
      'alert',
    ]),
    prevent() {
      return this.alert && this.alert.prevent;
    },
    message() {
      return this.alert.message;
    },
    confirm() {
      return this.alert && this.alert.confirm;
    },
    after() {
      return this.alert && this.alert.after;
    },
    push() {
      return this.alert && this.alert.isPush;
    },
  },
  methods: {
    ok() {
      if (this.confirm && typeof this.confirm === 'function') {
        this.confirm();
      }

      if (this.after && typeof this.after === 'function') {
        this.after();
      }

      this.cancel();
    },
    cancel() {
      this.$alert.close();
    },
    disableFocus() {
      const focusElement = Object.values(document.querySelectorAll(':focus'));

      focusElement.forEach(v => v.blur());
    },
    addKeyEvent() {
      window.addEventListener('keyup', this.keyEvent, true);
    },
    removeKeyEvent() {
      window.removeEventListener('keyup', this.keyEvent, true);
    },
    keyEvent(event) {
      const { key } = event;

      event.stopPropagation();

      if (!key) {
        this.cancel();
        return;
      }

      if ((/enter/i).test(key)) {
        this.ok();
        return;
      }

      if ((/esc/i).test(key)) {
        this.cancel();
      }
    },
  },
};
</script>

<style scoped lang="scss" src="@/assets/styles/component/alert.scss"></style>
