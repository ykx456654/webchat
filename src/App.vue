<template>
    <div id="app">
        <keep-alive :include="keepAlives">
            <router-view v-show="!show"></router-view>
        </keep-alive>
        <loading v-show="show"></loading>
        <transition  name="fade-bottom">
            <tab class="app-tab-bottom" v-show="tabS"></tab>
        </transition>
    </div>
</template>

<script>
// var FastClick = require('fastclick');
// FastClick.attach(document.body);
import { mapMutations } from 'vuex'
import loading from './components/common/loading'
import tab from './components/common/tab'

export default {
  name: 'app',
  components:{loading,tab},
  computed: {
    uid () {
        return this.$store.getters.uid
    },
    show () {
        return this.$store.state.base.loading
    },
    tabS () {
        return this.$store.state.base.tabShow
    },
    keepAlives () {
        return this.$store.state.base.keepAliveComponents.toString()
    }
  },
  methods: {
      ...mapMutations([
        'showLoad','hideLoad','showTab','hideTab','tabChange'
      ]),
  }
}
</script>

<style lang="less">
/* @import './assets/less/video.css'; */
@import '../node_modules/flex.css/dist/data-flex.css';
@import url(./assets/less/reset.less);
@import url(./assets/less/layout.less);
@import url(./assets/less/mint.less);
@import url(./assets/less/vux.less);
@import url(./assets/less/set.less);
video::-webkit-media-controls-panel,
video::-webkit-media-controls-panel-container,
video::-webkit-media-controls-start-playback-button {
  display:none !important;
  -webkit-appearance: none;
}
#app {
  font-family: 'Microsoft Yahei', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  height: 100%;
  position: relative;
  left: 0;
  top: 0;
}
html,body{
  height: 100%;
}

.fade-bottom-enter-active, .fade-bottom-leave-active {
  transition: all .5s;
  &>footer{
    bottom: -55px;
  }
}
.fade-bottom-enter, .fade-bottom-leave-active {
  opacity: 0;
}
</style>
