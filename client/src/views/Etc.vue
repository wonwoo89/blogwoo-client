<template>
  <div class="etc">
    <div class="creator">
      <h4 class="title">Creator</h4>
      <transition-group name="lazy-text" tag="div" class="markdown">
        <span
          v-for="(text, index) of creatorText"
          :key="$setKey(index)"
          class="text font white">
          {{text}}
        </span>
      </transition-group>
    </div>
    <div v-if="aboutOrigin" class="about">
      <h4 class="title">About</h4>
      <transition-group name="lazy-text" tag="div" class="markdown">
        <span
          v-for="(text, index) of aboutText"
          :key="$setKey(index)"
          class="text font white">
          {{text}}
        </span>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'etc',
  data() {
    return {
      creator: [],
      creatorOrigin: '',
      about: [],
      aboutOrigin: '',
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    creatorText() {
      return this.creator;
    },
    aboutText() {
      return this.about;
    },
  },
  methods: {
    getData() {
      this.$API.get('/etc')
        .then(({ data }) => {
          const { code, result } = data;

          if (code === 200) {
            const { creator, about } = result;

            this.creatorOrigin = creator;
            // this.aboutOrigin = about;

            this.lazyString(this.creator, this.creatorOrigin);
            // this.lazyString(this.about, this.aboutOrigin);

            return;
          }

          throw Error();
        })
        .catch(console.error);
    },
    lazyString(accumulator, string) {
      const splitByNewLine = string.split(/\n/).slice();
      this.split(accumulator, splitByNewLine);
    },
    split(accumulator, arr) {
      const copy = arr.slice();
      const first = copy.shift();

      accumulator.push(first.trim());

      if (!copy.length) {
        return;
      }

      setTimeout(() => this.split(accumulator, copy), 100);
    },
  },
};
</script>

<style scoped lang="scss" src="@/assets/styles/view/etc.scss"></style>
