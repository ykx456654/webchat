<template>
    <transition name="question">
        <div class="question" @click="endQuestion" v-if="show">
            <div class="content">
                <div class="head">
                    <div class="title" v-text="info.title"></div>
                    <i class="icon icon-close" @click="endQuestion"></i>
                </div>
                <div class="question-content">
                    <iframe :src="info.url" frameborder="0"></iframe>
                </div>
            </div>
            <input type="radio" v-model="show"  style="display:none"/>
        </div>
    </transition>
</template>
<script>
export default {
    props:['value','info'],
    created () {
        this.show = this.value
    },
    data () {
        return {
            show: false
        }
    },
    methods:{
        endQuestion () {
            this.show = false
        }
    },
    watch: {
        show (nv) {
            this.$emit('input',nv)
        },
        value (nv) {
            this.show = nv
        }
    }
}
</script>
<style lang="less" scoped>
.question{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 500;
    background-color: rgba(0,0,0,0.3);
    width: 100%;
    height: 100%;
}
.content{
    width: 3rem;
    height: 3.75rem;
    margin-left: -1.5rem;
    margin-top: -1.875rem;
    background-color: #fff;
    border-radius: 2px;
    left:50%;
    top:45%;
    position: relative;
    overflow: hidden;
}
.head{
    background-color: #d93639;
    color:#fff;
    position: relative;
    font-size: 15px;
    height: 35px;
    line-height: 35px;
    width: 100%;
    .title{
        width: 70%;
        overflow: hidden;
        text-overflow:ellipsis; /*超出的设置为省略号*/
        white-space: nowrap;
        margin: 0 auto;
    }
    .icon{
        position: absolute;
        background-image: url(../../../assets/icons/icon_xzje_close.png);
        right: 10px;
        top: 10px;
        width: 12px;
        height: 12px;
    }
}
.question-content{
    height:calc(~"100% - 35px");
    padding-bottom: 10px;
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    iframe{
        height: 100%;
    }
}
.mask{
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,0.3);
}
.question-enter-active {
transition: all .5s ease;
}
.question-leave-active {
transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.question-enter, .question-leave-active {
transform: scale(1.1);
opacity: 0;
}
</style>


