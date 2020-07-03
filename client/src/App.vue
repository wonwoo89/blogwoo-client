<template>
  <div id="app">
    <div id="nav">
      <div class="back"></div>
      <div class="inner">
        <h4 class="title">Blogwoo</h4>
        <div class="display-mode">
          <div class="toggle">
            <button :key="`light`" type="button" class="btn btn-none"
                    @click="changeDisplayMode('light')">
              <svg viewBox="0 0 512 512" class="svg-icon sun">
                <path fill="currentColor"
                      d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4
                80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4
                33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5
                8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5
                100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31
                0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5
                13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181
                49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z">
                </path>
              </svg>
            </button>
            <button :key="`dark`" type="button" class="btn btn-none"
                    @click="changeDisplayMode('dark')">
              <svg viewBox="0 0 512 512" class="svg-icon moon">
                <path fill="currentColor"
                      d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792
                7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954
                0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156
                258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z">
                </path>
              </svg>
            </button>
          </div>
        </div>
        <div class="routes">
          <router-link
            v-for="route of routes"
            v-if="!route.hidden"
            :key="$setKey(route)"
            :to="route.to"
            class="route">
            <span class="indicator">❯</span>
            <span v-html="route.name"></span>
          </router-link>
        </div>
      </div>
    </div>
    <router-view class="router-view"/>
    <Alert/>
  </div>
</template>

<script>
import Alert from './components/common/Alert.vue';
export default {
  name: 'app',
  components: {
    Alert,
  },
  data() {
    return {
      displayMode: window.localStorage.getItem('displayMode'),
    };
  },
  mounted() {
    this.changeDisplayMode(this.mode);
  },
  watch: {
    mode(newMode, oldMode) {
      if (newMode !== oldMode) {
        this.changeDisplayMode(newMode);
      }
    },
  },
  computed: {
    routes() {
      return [
        {
          name: `Post${this.detailRoute}${this.editRoute}`,
          to: `/post${this.editRoute ? `/${this.postID}` : ''}`,
          hidden: (/wallet/gi).test(this.$route.name),
        },
        {
          name: 'Etc',
          to: '/etc',
          hidden: (/wallet/gi).test(this.$route.name),
        },
        {
          name: 'Publish',
          to: '/publish',
          hidden: !(/publish/gi).test(this.$route.name),
        },
        {
          name: 'Wallet',
          to: '/wallet',
          hidden: !(/wallet/gi).test(this.$route.name),
        },
      ];
    },
    postID() {
      return this.$route.params.postID;
    },
    detailRoute() {
      return this.nameCheck('detail') ? ` ❯ ${this.postID}` : '';
    },
    editRoute() {
      return this.nameCheck('edit') ? ` ❯ ${this.postID} ❯ Edit` : '';
    },
    mode() {
      return this.displayMode;
    },
  },
  methods: {
    nameCheck(name) {
      const nameReg = new RegExp(name, 'gi');
      return nameReg.test(this.$route.name);
    },
    changeDisplayMode(mode) {
      if (!mode) {
        return;
      }

      this.displayMode = mode;
      window.localStorage.setItem('displayMode', mode);
      document.body.parentNode.setAttribute('mode', mode);
    },
  }
};
</script>

<style lang="scss" src="@/assets/styles/app.scss"></style>
