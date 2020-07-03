<template>
  <div class="post">
    <transition name="post-detail">
      <router-view/>
    </transition>
    <List
      v-if="$route.name !== 'Edit'"
      :postList="postList"
      :postID="postID"
    />
  </div>
</template>

<script>
import dateFormat from '@/util/date/format';
import List from '@/components/post/List.vue';

export default {
  name: 'post',
  components: {
    List,
  },
  data() {
    return {
      posts: [],
    };
  },
  created() {
    if (this.tagName && !(/all/gi).test(this.tagName)) {
      this.searchTagData(this.tagName);
    } else {
      this.getData();
    }
  },
  watch: {
    postID(id) {
      if (!id) {
        this.getData();
      }
    },
    tagName(newTag, prevTag) {
      if (newTag && newTag === prevTag) {
        return;
      }

      if ((/all/i).test(newTag)) {
        if (prevTag && prevTag !== newTag) {
          this.getData();
        }
      } else {
        this.searchTagData(newTag);
      }
    },
  },
  computed: {
    postList() {
      return this.posts;
    },
    postID() {
      return +this.$route.params.postID;
    },
    tagName() {
      return this.$route.query.tag;
    },
  },
  methods: {
    getData() {
      this.$API.get('/post')
        .then(this.setData)
        .catch(console.error);
    },
    searchTagData(tagName) {
      const params = { tagName };

      this.$API.get('/search', { params })
        .then(this.setData)
        .catch(console.error);
    },
    setData({ data }) {
      if (data.code === 200) {
        this.posts = data.result.map((post) => ({
          ...post,
          createTime: dateFormat(post.createTime, '%Y.%m.%d'),
          plainContents: post.contents.replace(/(<([^>]+)>)/gi, ''),
        }));
      }
    },
  },
};
</script>

<style scoped lang="scss" src="@/assets/styles/view/post.scss"></style>
