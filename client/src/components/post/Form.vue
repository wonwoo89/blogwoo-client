<template>
  <div id="form">
    <div class="main">
      <div class="inner">
        <div class="subject">
          <label>
            <input type="text"
                   name="subject"
                   placeholder="Title"
                   class="form-control font white s24 bold"
                   @input="title = $event.target.value"/>
          </label>
        </div>
        <div class="board">
          <label>
            <textarea
              name="contents"
              placeholder="Enter the content"
              class="form-control font s14"
              @keydown.tab.prevent="altTab"
              @keyup="textData">
            </textarea>
          </label>
          <div class="markdown" :class="markdownShow">
            <div class="scroll">
              <div class="text font s14" v-html="markdownText"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="submit">
      <div class="inner">
        <div class="button-group">
          <button type="button" class="cancel btn font gray-dark s18" @click="back">Cancel</button>
          <button v-if="$route.meta.editable" @click="deletePost"
                  type="button" class="cancel btn font gray-dark s18">Delete</button>
          <button type="button" class="send btn font s18" @click="checkForm">Next</button>
        </div>
      </div>
    </div>
    <div v-if="tagShow" class="tag-box">
      <div class="background" @click="showTag"></div>
      <div class="float">
        <div class="form-group">
          <label>
            <input type="text" class="form-control font black s16"
                   placeholder="Enter a tag"
                   @input="tag = $event.target.value"
                   @keyup.enter="addTag"
                   @keyup.tab="addTag"/>
          </label>
        </div>
        <div class="list">
          <button type="button" class="btn tag"
                  v-for="t in tagListData" :key="t"
                  @click="delTag(t)">
            <span class="font white">{{t}}</span>
          </button>
        </div>
        <div class="button-group">
          <button type="button" class="btn cancel" @click="showTag">
            <span class="font gray-dark s16">Back</span>
          </button>
          <button type="button" class="btn skip" @click="action(true)">
            <span class="font black s16">Skip</span>
          </button>
          <button type="button" class="btn finish" @click="action(false)">
            <span class="font black s16">Finish</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Markdown from '@/util/markdown';

export default {
  name: 'write-form',
  data() {
    return {
      title: '',
      textareaHeight: 0,
      markdownTypeText: '',
      markdownShowStatus: false,
      markdown: new Markdown(),
      primitiveContents: '',
      tagShow: false,
      tag: '',
      tagList: [],
      post: null,
    };
  },
  mounted() {
    this.setUp();
  },
  computed: {
    markdownText() {
      return this.markdownTypeText || '<span class="font s14 gray-bold">Index area</span>';
    },
    markdownShow() {
      return this.markdownShowStatus && 'show';
    },
    postData() {
      return this.post;
    },
    postID() {
      return this.$route.params.postID;
    },
    tagListData() {
      return this.tagList;
    },
  },
  methods: {
    setUp() {
      if (this.$route.meta.editable) {
        this.$API.get(`/post/${this.postID}`)
          .then(({ data }) => {
            if (data.code === 200) {
              const { result } = data;
              this.post = {
                ...result,
              };

              const { title, primitiveContents, tag } = this.post;
              const subject = document.querySelector('input[name="subject"]');
              const contents = document.querySelector('textarea[name="contents"]');

              this.title = title;
              this.primitiveContents = primitiveContents;
              this.markdownTypeText = this.markdown.transform(primitiveContents);
              this.tagList = this.tagList.concat(tag);

              subject.value = title;
              contents.value = primitiveContents;
            }
          })
          .catch(console.error);
      }

      this.scroll();
    },
    scroll() {
      setTimeout(() => {
        const contents = document.querySelector('textarea[name="contents"]');
        const markdown = document.querySelector('.markdown .scroll');

        contents.addEventListener('scroll', ({ target }) => {
          this.markdownScrollSet(target, markdown);
        });
      }, 1000);
    },
    textData({ target }) {
      const markdown = document.querySelector('.markdown .scroll');
      const { value } = target;

      this.primitiveContents = value;
      this.markdownTypeText = this.markdown.transform(value);
      this.markdownScrollSet(target, markdown);
    },
    markdownScrollSet(textarea, markdown) {
      const { scrollTop, scrollHeight, clientHeight } = textarea;
      const taHeight = scrollHeight - clientHeight;

      setTimeout(() => {
        const mdScrollHeight = markdown.scrollHeight;
        const mdClientHeight = markdown.clientHeight;
        const mdHeight = mdScrollHeight - mdClientHeight;

        markdown.scrollTo(0, ((mdHeight) * scrollTop) / (taHeight));
      });
    },
    altTab({ target }) {
      const { value, selectionStart, selectionEnd } = target;
      const start = value.substring(0, selectionStart);
      const end = value.substring(selectionEnd);
      const cursorPoint = selectionStart + 4; // tab = 4 space

      Object.assign(target, {
        value: `${start}    ${end}`, // alter tab
        selectionStart: cursorPoint,
        selectionEnd: cursorPoint,
      });
    },
    checkForm() {
      if (!this.title) {
        const titleElement = document.querySelector('.form-control[name="subject"]');

        this.$alert.warn({
          message: 'Please enter a title',
          method: () => titleElement.focus(),
        });

        return;
      }

      if (!this.markdownTypeText) {
        const contentsElement = document.querySelector('.form-control[name="contents"]');

        this.$alert.warn({
          message: 'Please enter the content',
          method: () => contentsElement.focus(),
        });

        return;
      }

      this.showTag();
    },
    showTag() {
      this.tagShow = !this.tagShow;
    },
    addTag({ target }) {
      if (this.tag) {
        if (!this.tagList.includes(this.tag)) {
          this.tagList.push(this.tag);
          this.tag = '';

          Object.assign(target, { value: '' });
        } else {
          this.$store.commit('notice', 'This tag has already been added.');
        }
      } else {
        this.$store.commit('notice', 'Please enter a tag');
      }
    },
    delTag(tag) {
      const index = this.tagList.indexOf(tag);
      this.tagList.splice(index, 1);
    },
    action(tagSkip) {
      const send = (p) => {
        const success = ({ data }) => {
          if (data.code === 200) {
            this.$router.push({ name: 'Post' });
          }
        };

        if (this.$route.meta.editable) {
          this.$API.put(`/post/${this.postID}`, p).then(success);
        } else {
          this.$API.post('/post', p).then(success);
        }
      };

      const params = {
        thumbnail: '',
        title: this.title,
        contents: this.markdownTypeText,
        primitiveContents: this.primitiveContents,
        tag: this.tagList,
      };

      if (tagSkip) {
        if (this.tagList.length > 0) {
          this.$alert.confirm({
            message: 'The tag you entered will be deleted.\nDo you want to proceed?',
            method: () => send(params),
          });
        } else {
          this.$alert.confirm({
            message: 'You didn\'t enter a tag.\nDo you want to proceed?',
            method: () => send(params),
          });
        }
      } else if (this.tagList.length > 0) {
        send(params);
      } else {
        this.$alert.warn({
          message: 'Please enter a tag',
        });
      }
    },
    back() {
      this.$router.back();
    },
    deletePost() {
      this.$alert.confirm({
        message: 'Are you sure you want to delete?',
        method: () => {
          this.$API.delete(`/post/${this.postID}`)
            .then(() => this.$router.push({
              name: 'Post',
            }));
        }
      });
    },
  },
};
</script>

<style scoped lang="scss" src="@/assets/styles/component/form.scss"></style>
