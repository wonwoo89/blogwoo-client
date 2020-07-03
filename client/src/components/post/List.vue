<template>
  <div class="wrapper">
    <div v-if="tagData.length && !postID" class="tag all">
      <div class="inner">
        <h4 class="title">#Tag</h4>
        <transition-group name="tag" tag="div" class="list">
        <span v-for="tag of tagData" :key="$setKey(tag)" class="item" @click="search(tag.tagName)">
          <span class="name font s12">{{tag.tagName}}</span>
          <span class="count font gray-bold s10">{{tag.count}}</span>
        </span>
        </transition-group>
      </div>
    </div>
    <transition-group name="post-list" tag="div" class="list" :class="postID && 'full'">
      <div v-for="post of postList"
           v-if="post.postID !== postID"
           :key="$setKey(post)"
           class="item"
           @click="showPostDetail(post.postID)">
        <h3 class="title">{{post.title}}</h3>
        <div class="tag">
          <span v-for="tag of post.tag"
                :key="tag"
                class="font white s12">#{{tag}}</span>
        </div>
        <div v-if="!postID" class="created font s10 gray-bold">{{post.createTime}}</div>
        <div v-if="!postID" class="contents font s12 gray-bold">{{post.plainContents}}</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'list',
  props: {
    postList: Array,
    postID: Number,
  },
  data() {
    return {
      tag: [],
      tagOrigin: null,
      tagFixed: false,
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.scrollEventBind();
  },
  destroyed() {
    this.scrollEventRemove();
  },
  computed: {
    tagData() {
      return this.tag;
    },
  },
  methods: {
    getData() {
      this.$API.get('/tag')
        .then(this.setData)
        .catch(console.error);
    },
    setData({ data }) {
      if (data.code === 200) {
        const all = data.result
          .reduce((acc, value) => {
            acc.count += value.count;
            return acc;
          }, {
            tagName: 'All',
            count: 0,
          });

        const tagOrigin = data.result
          .map((value) => ({
            ...value,
            tagName: `#${value.tagName}`,
          }));

        tagOrigin.unshift(all);

        this.tagOrigin = tagOrigin;
        this.lazyList(this.tag, this.tagOrigin);
      }
    },
    showPostDetail(postID) {
      this.$router.push({
        name: 'Detail',
        params: {
          postID,
        },
        query: {
          tag: this.$route.query.tag,
        },
      });
    },
    lazyList(accumulator, list) {
      const copy = list.slice();
      const first = copy.shift();

      accumulator.push(first);

      if (!copy.length) {
        return;
      }

      setTimeout(() => this.lazyList(accumulator, copy), 100);
    },
    search(tag) {
      let replaceTag = tag.replace('#', '');

      if (replaceTag === this.$route.query.tag) {
        return;
      }

      if ((/all/i).test(replaceTag)) {
        replaceTag = undefined;
      }

      this.$router.push({
        name: 'Post',
        query: {
          tag: replaceTag,
        },
      });
    },
    scrollEventBind() {
      window.addEventListener('scroll', this.scrollEvent);
    },
    scrollEventRemove() {
      window.removeEventListener('scroll', this.scrollEvent);
    },
    scrollEvent() {
      const tagList = document.querySelector('.tag.all');

      if (!tagList) {
        return;
      }

      const { scrollY } = window;

      if (scrollY >= 40 && !this.tagFixed) {
        this.tagFixed = true;
        tagList.className = `${tagList.className} fixed`;
      }

      if (scrollY < 40 && this.tagFixed) {
        this.tagFixed = false;
        tagList.className = tagList.className.replace(/fixed/gi, '').trim();
      }
    }
  }
};
</script>

<style scoped lang="scss" src="@/assets/styles/component/list.scss"></style>
