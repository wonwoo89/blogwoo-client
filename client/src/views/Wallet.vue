<template>
  <div v-if="ready" class="wallet">
    <div v-if="needSign" class="sign form">
      <div class="form-control">
        <label for="id">
          <input type="text" id="id" class="form-control" placeholder="ID"
                 v-model="sign.id"/>
        </label>
        <label for="name">
          <input type="text" id="name" class="form-control" placeholder="Name"
                 v-model="sign.name" @keyup.enter="signIn"/>
        </label>
      </div>
      <button type="button" class="btn btn-default" @click="signIn">Sign In</button>
    </div>
    <template v-else>
      <transition-group name="timeline" tag="div" class="timeline">
        <div v-for="(log, index) of timeline" :key="log.id" class="log" @click="spread(log, index)">
          <button type="button"
                  class="btn btn-none btn-spread"
                  :class="log.spread && 'open'"></button>
          <span class="date font s14">{{log.date}}</span>
          <span class="user font s12">{{log.nickname}}</span>
          <span class="card font s14 bold">{{log.card}}</span>
          <span class="value font s20 bold"
                :class="log.type">{{log.value.toLocaleString()}}<span class="font s14">원</span>
          </span>
          <span v-if="log.spread" class="description">{{log.description}}</span>
        </div>
      </transition-group>
      <transition name="add-box">
        <section v-if="add" class="add-box">
          <div class="inner"></div>
        </section>
      </transition>
      <button type="button"
              class="btn btn-float btn-add font s36"
              :class="add && 'cancel'"
              @click="addWallet">+</button>
    </template>
  </div>
</template>

<script>
import dateFormat from '../util/date/format';

export default {
  name: 'wallet',
  data() {
    return {
      ready: false,
      sign: {
        id: localStorage.getItem('blogwoo_wallet_id'),
        name: localStorage.getItem('blogwoo_wallet_name'),
        nickname: null,
      },
      timeline: [],
      add: false,
    };
  },
  created() {
    this.signIn();
  },
  computed: {
    needSign() {
      return !this.sign.id || !this.sign.name;
    },
    total() {
      return this.timeline.reduce((acc, log) => {
        const minus = log.type === 'expenses';
        return acc + (minus ? (-log.value) : log.value);
      }, 0);
    },
  },
  methods: {
    signIn() {
      const { id, name } = this.sign;

      if (id && name) {
        const params = {
          id,
          name,
        };

        this.$Wallet.post('/user', params)
          .then(({ data }) => {
            const { nickname } = data;

            this.sign.nickname = nickname;

            localStorage.setItem('blogwoo_wallet_id', id);
            localStorage.setItem('blogwoo_wallet_name', name);
            localStorage.setItem('blogwoo_wallet_nickname', nickname);

            return this.getTimeline();
          })
          .then(({ data }) => {
            this.timeline = data.map((log) => ({
              ...log,
              date: dateFormat(log.date, '%Y.%m.%d %H:%M'),
            }));
          })
          .catch(this.error);
      }

      this.ready = true;
    },
    getTimeline() {
      return this.$Wallet.get('/timeline');
    },
    error(err) {
      if (err.response) {
        const { status } = err.response;
        const { message } = err.response.data;

        if (status === 500) {
          this.$alert.warn({ message });
        }
      }
    },
    addWallet() {
      this.add = !this.add;
    },
    spread(log, index) {
      const newLog = {
        ...log,
        spread: !log.spread,
      };

      this.timeline.splice(index, 1, newLog);
      this.timeline = this.timeline.slice();
    },
  },
};
</script>

<style scoped lang="scss">
  @import '@/assets/styles/preset/color.scss';

  button,
  .form-control {
    outline: none;
  }

  .sign {
    position: absolute;
    top: 30%;
    left: 50%;
    width: 300px;
    transform: translateX(-50%) translateY(-30%);
    label {
      &:last-child {
        .form-control {
          margin-bottom: 0;
        }
      }
      .form-control {
        border-bottom-color: #{$darkGray};
        margin-bottom: 10px;
        color: #{$white};
        &:focus {
          border-bottom-color: #{$white};
        }
      }
    }
    .btn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .timeline {
    .log {
      position: relative;
      border-radius: 10px;
      background: #{$white};
      padding: 20px;
      margin: 0 auto 15px;
      box-shadow: 1px 1px 5px 0 #{$darkGray};
      transition: all .3s ease;
      &:last-child {
        margin-bottom: 40px;
      }
      .btn-spread {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 20px;
        height: 20px;
        &.open {
          &:before {
            transform: rotate(-45deg);
          }
          &:after {
            transform: rotate(45deg);
          }
        }
        &:before,
        &:after {
          position: absolute;
          content: '';
          top: 50%;
          width: 10px;
          height: 2px;
          border-radius: 2px;
          background: #{$darkGray};
          transform: translateY(-50%);
          transition: transform .3s ease;
        }
        &:before {
          left: 2px;
          transform: rotate(45deg);
        }
        &:after {
          right: 2px;
          transform: rotate(-45deg);
        }
      }
      .date,
      .user,
      .card,
      .value {
        display: inline-block;
        width: 100%;
        color: #{$black};
      }
      .date {
        margin-bottom: 15px;
        color: #{$darkGray};
      }
      .user {
        margin-bottom: 5px;
        color: #{$darkGray};
      }
      .value {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: auto;
        text-align: right;
        &.income {
          &:before {
            content: '+';
            margin-right: 5px;
          }
          color: #{$blue};
        }
        &.expenses {
          &:before {
            content: '-';
            margin-right: 5px;
          }
          color: #{$red};
        }
      }
    }
  }

  .add-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #{$black1d}b3;
    padding: 80px 30px 90px;
    transition: all .3s ease;
    .inner {
      width: 100%;
      max-width: 1024px;
      height: 100%;
      border: 0;
      border-radius: 10px;
      background: #{$white};
      box-shadow: 0px 0px 10px 0 #{$darkGray};
      margin: 0 auto;
    }
  }
  .btn-float {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
    border: 0;
    border-radius: 50%;
    background: #{$blue};
    box-shadow: 0 0 5px 0 #{$darkGray};
    color: #{$white};
    padding: 0;
    margin: 0;
    transition: transform .3s ease;
    &.cancel {
      transform: rotate(45deg);
    }
  }

  .add-box-enter,
  .add-box-leave-to {
    opacity: 0;
  }

  .timeline-enter,
  .timeline-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }
  .timeline-enter-active {
    transition-duration: 1s !important;
  }

  html[mode="light"] {
    .sign {
      label {
        .form-control {
          border-bottom-color: #{$gray};
          color: inherit;
          &:focus {
            border-bottom-color: #{$black};
          }
        }
      }
      .btn {
        background: #{$black};
        color: #{$white};
        &:hover {
          background: #{$white};
          color: #{$black};
        }
      }
    }
    .add-box {
      background: #{$white}80;
    }
  }
</style>
