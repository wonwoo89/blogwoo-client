<template>
  <div v-if="postData" class="post-detail">
    <div class="header">
      <h2 class="title">{{postData.title}}</h2>
      <div class="tag">
        <span v-for="tag of postData.tag" :key="tag" class="font white s12">#{{tag}}</span>
      </div>
      <span class="created font s14">{{postData.createTime}} written</span>
      <span v-if="postData.updateTime" class="updated font s14">{{postData.updateTime}} updated</span>
    </div>
    <div class="body">
      <div class="contents markdown" v-html="postData.contents"></div>
      <div class="button-group to-list">
        <router-link :to="{
          name: 'Post',
          query: {
            tag: $route.query.tag,
          },
        }">❯ List</router-link>
      </div>
    </div>
    <div class="reply">
      <div id="lv-container" data-id="city" data-uid="MTAyMC80Mjg1Mi8xOTM5OQ=="></div>
    </div>
  </div>
</template>

<script>
import dateFormat from '@/util/date/format';

export default {
  name: 'postDetail',
  data() {
    return {
      post: null,
      livereReady: false,
    };
  },
  metaInfo() {
    return {
      script: [
        {
          src: this.livereReady ? 'https://cdn-city.livere.com/js/embed.dist.js' : '',
        },
      ],
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.initLivere();
  },
  destroyed() {
    window.LivereTower = null;
  },
  watch: {
    postID() {
      this.getData();
      this.initLivere();
    },
  },
  computed: {
    postID() {
      return this.$route.params.postID;
    },
    postData() {
      return this.post;
    },
  },
  methods: {
    getData() {
      this.$API.get(`/post/${this.postID}`)
        .then(this.setData)
        .catch(console.error);
    },
    setData({ data }) {
      if (data.code === 200) {
        const { result } = data;
        const format = '%Y.%m.%d %H:%M:%S';
        const transfer = (datetime) => dateFormat(datetime, format);

        this.post = {
          ...result,
          createTime: transfer(result.createTime),
          updateTime: transfer(result.updateTime),
        };
      }
    },
    initLivere() {
      const livereDom = document.querySelector('#lv-container');

      if (!livereDom) {
        setTimeout(this.initLivere, 200);
        return;
      }

      if (typeof LivereTower === 'object' && LivereTower) {
        LivereTower.reload();
        return;
      }

      this.livereReady = true;
    },
  },
};
</script>

<style scoped lang="scss" src="@/assets/styles/component/postDetail.scss"></style>
