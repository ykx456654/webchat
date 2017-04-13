<template>
  <div class="video-player">
    <video class="video-js vjs-custom-skin"></video>
  </div>
</template>

<script>
  window.videojs = require('video.js')
  require('video.js/dist/video-js.css')
  // require('videojs-resolution-switcher')
  export default {
    name: 'video-player',
    props: {
      options: {
        type: Object,
        required: true
      }
    },
    mounted() {
      if (!this.player) { 
        this.initialize()
      }
    },
    beforeDestroy() {
      if (this.player) { 
        this.dispose()
      }
    },
    methods: {
      initialize() {

        // init
        var self = this
        this.player = null
        // console.log(JSON.stringify(this.options))
        // options
        var videoOptions = Object.assign({

          // component options
          start: 0,
          playsinline: false,
          customEventName: 'statechanged',

 
          autoplay: false,
          controls: true,
          preload: 'auto',
          fluid: false,
          muted: false,
          width: '100%',
          height: '360',
          language: 'en',
          controlBar: {
            remainingTimeDisplay: false,
            playToggle: {},
            progressControl: {},
            fullscreenToggle: {},
            volumeMenuButton: {
              inline: false,
              vertical: true
            }
          },
          techOrder: ['html5', 'flash'],
          playbackRates: []
        }, this.options)
        // console.log(videoOptions)
        // check sources

        if (!videoOptions.sources || !videoOptions.sources.length) {
          console.warn('Missing required option: "sources".')
          return false
        }


        // add language

        // ios fullscreen
        var playsinline = videoOptions.playsinline
        if (playsinline) {
          this.$el.children[0].setAttribute('playsinline', playsinline)
          this.$el.children[0].setAttribute('webkit-playsinline', playsinline)
        }

        // emit event
        var emitPlayerState = function (event, value) {
          if (event) {
            self.$emit(event, self.player)
          }
          if (value) {
            var values = {}
            values[event] = value
            self.$emit(videoOptions.customEventName, values)
          }
        }

        // videoOptions
        // console.log(videoOptions)

        this.player = videojs(this.$el.children[0], videoOptions, function() {

          // player readied
          self.$emit('ready', self.player)

          this.on('loadeddata', function() {
            this.muted(videoOptions.muted)
            this.currentTime(videoOptions.start)
            emitPlayerState('loadeddata', true)
          })

          this.on('canplay', function() {
            emitPlayerState('canplay', true)
          })

          this.on('canplaythrough', function() {
            emitPlayerState('canplaythrough', true)
          })

          this.on('play', function() {
            emitPlayerState('play', true)
          })

          this.on('pause', function() {
            emitPlayerState('pause', true)
          })

          this.on('waiting', function() {
            emitPlayerState('waiting', true)
          })

          this.on('playing', function() {
            emitPlayerState('playing', true)
          })

          this.on('ended', function() {
            emitPlayerState('ended', true)
          })

          this.on('timeupdate', function() {
            emitPlayerState('timeupdate', this.currentTime())
          })
        })
      },
      dispose() {
        if (this.player && videojs) {
          this.player.pause && this.player.pause()
          videojs(this.$el.children[0]).dispose()
          if (!this.$el.children.length) {
            var video = document.createElement('video')
            video.className = 'video-js vjs-custom-skin'
            this.$el.appendChild(video)
          }
          this.player = null
        }
      }
    },
    watch: {
      options: {
        deep: true,
        handler(options, oldOptions) {
          this.dispose()
          // console.log(this.options.sources)
          if (options && options.sources && options.sources.length) {
            try{
              this.initialize()
            }catch(e){
              console.log(e)
            }
          }
        }
      }
    }
  }
</script>

<style>
.video-js.vjs-custom-skin {
  width: 100%;
  font-family: "PingFang SC","Helvetica Neue","Hiragino Sans GB","Segoe UI","Microsoft YaHei","微软雅黑",sans-serif;
}

.video-js.vjs-custom-skin .vjs-menu-button-inline.vjs-slider-active,.video-js.vjs-custom-skin .vjs-menu-button-inline:focus,.video-js.vjs-custom-skin .vjs-menu-button-inline:hover,.video-js.vjs-no-flex .vjs-menu-button-inline {
  width: 10em
}

.video-js.vjs-custom-skin .vjs-controls-disabled .vjs-big-play-button {
  display: none!important
}

.video-js.vjs-custom-skin .vjs-control {
  width: 3em
}

.video-js.vjs-custom-skin .vjs-control.vjs-live-control{
  width: auto;
  padding-left: .5em;
  letter-spacing: .1em;
}

.video-js.vjs-custom-skin .vjs-menu-button-inline:before {
  width: 1.5em
}

.vjs-menu-button-inline .vjs-menu {
  left: 3em
}

.vjs-paused.vjs-has-started.video-js.vjs-custom-skin .vjs-big-play-button,.video-js.vjs-ended .vjs-big-play-button,.video-js.vjs-paused .vjs-big-play-button {
  display: block
}

.video-js.vjs-custom-skin .vjs-load-progress div,.vjs-seeking .vjs-big-play-button,.vjs-waiting .vjs-big-play-button {
  display: none!important
}

.video-js.vjs-custom-skin .vjs-mouse-display:after,.video-js.vjs-custom-skin .vjs-play-progress:after {
  padding: 0 .4em .3em
}

.video-js.vjs-ended .vjs-loading-spinner {
  display: none;
}

.video-js.vjs-ended .vjs-big-play-button {
  display: block !important;
}

.video-js.vjs-ended .vjs-big-play-button,.video-js.vjs-paused .vjs-big-play-button,.vjs-paused.vjs-has-started.video-js.vjs-custom-skin .vjs-big-play-button {
  display: block
}

.video-js.vjs-custom-skin .vjs-big-play-button {
  top: 50%;
  left: 50%;
  margin-left: -1.5em;
  margin-top: -1em
}

.video-js.vjs-custom-skin .vjs-big-play-button {
  background-color: rgba(0,0,0,0.45);
  font-size: 3.5em;
   /*border-radius: 50%;*/
  height: 2em !important;
  line-height: 2em !important;
  margin-top: -1em !important
}

.video-js:hover .vjs-big-play-button,.video-js.vjs-custom-skin .vjs-big-play-button:focus,.video-js.vjs-custom-skin .vjs-big-play-button:active {
  background-color: rgba(36,131,213,0.9)
}

.video-js.vjs-custom-skin .vjs-loading-spinner {
  border-color: rgba(36,131,213,0.8)
}

.video-js.vjs-custom-skin .vjs-control-bar2 {
  background-color: #000000
}

.video-js.vjs-custom-skin .vjs-control-bar {
   /*background-color: rgba(0,0,0,0.3) !important;*/
  color: #ffffff;
  font-size: 14px
}

.video-js.vjs-custom-skin .vjs-play-progress,.video-js.vjs-custom-skin  .vjs-volume-level {
  background-color: #2483d5
}

.video-js.vjs-custom-skin .vjs-play-progress:before {
  top: -0.3em;
}

.video-js.vjs-custom-skin .vjs-progress-control:hover .vjs-progress-holder {
  font-size: 1.3em;
}

.vjs-menu-button-popup.vjs-volume-menu-button-vertical .vjs-menu {
  left: 0em;
}

.video-js.vjs-custom-skin .vjs-menu li {
  padding: 0;
  line-height: 2em;
  font-size: 1.1em;
  font-family: "PingFang SC","Helvetica Neue","Hiragino Sans GB","Segoe UI","Microsoft YaHei","微软雅黑",sans-serif;
}

.video-js.vjs-custom-skin .vjs-time-tooltip,
.video-js.vjs-custom-skin .vjs-mouse-display:after, 
.video-js.vjs-custom-skin .vjs-play-progress:after {
  border-radius: 0;
  font-size: 1em;
  padding: 0;
  width: 3em;
  height: 1.5em;
  line-height: 1.5em;
  top: -3em;
}

.video-js.vjs-custom-skin .vjs-menu-button-popup .vjs-menu {
  width: 5em;
  left: -1em;
}

.video-js.vjs-custom-skin .vjs-menu-button-popup.vjs-volume-menu-button-vertical .vjs-menu {
  left: 0;
}

.video-js.vjs-custom-skin .vjs-control-bar .vjs-resolution-button .vjs-menu {
   /*order: 4;*/
}

 /*排序顺序*/
.video-js.vjs-custom-skin .vjs-control-bar .vjs-play-control {
  order: 0;
}

.video-js.vjs-custom-skin .vjs-control-bar .vjs-time-control {
  min-width: 1em;
  padding: 0;
  margin: 0 .1em;
  text-align: center;
  display: block;
  order: 1;
}

.video-js.vjs-custom-skin .vjs-control-bar .vjs-playback-rate .vjs-playback-rate-value{
  font-size: 1.2em;
  line-height: 2.4;
}

.video-js.vjs-custom-skin .vjs-progress-control.vjs-control {
  order: 2;
}

.video-js.vjs-custom-skin .vjs-control-bar .vjs-volume-menu-button {
  order: 3;
}

.video-js.vjs-custom-skin .vjs-control-bar .vjs-resolution-button {
  order: 4;
}

.video-js.vjs-custom-skin .vjs-control-bar .vjs-resolution-button .vjs-resolution-button-label {
  display: block;
  line-height: 3em;
}

.video-js.vjs-custom-skin .vjs-control-bar .vjs-playback-rate {
  order: 5;
}

.video-js.vjs-custom-skin .vjs-control-bar .vjs-fullscreen-control {
  order: 6;
}




</style>
