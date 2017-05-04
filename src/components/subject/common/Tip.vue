<template>
    <transition name="fade">
        <div class="tip" @click="closeTip">
            <i class="icon icon-close" ></i>
            <div class="tranggle"></div>
            <span  v-text="content"></span>
        </div>
    </transition>
</template>
<script>
    export default {
        props:{
            content:String,   
        },
        data () {
            return {
                position: {
                    top: 0,
                    left: 0
                },
                show: true,
                popoverStyle: {}
            }
        },
        mounted () {

        },
        methods:{
            closeTip () {
                this.$emit('close')
            }
        }
    }
</script>
<style lang="less">
    .tip{
        position: fixed;
        z-index: 0;
        display: inline-block;
        width: 50%;
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        border-radius: 5px;
        padding: 5px 10px 5px 10px;
        text-align: left;
        right: 5px;
        top: 0.5rem;
        padding-right: 15px;
        z-index: 1001;
        .icon{
            position: absolute;
            width: 10px;
            height: 10px;
            right: 5px;
            top: 5px;
        }
        .tranggle{
            position: absolute;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 12px solid rgba(0, 0, 0, 0.5);
            right: 15px;
            top: -12px;
            z-index: 1002;
        }
    }
    .fade-enter-active {
    transition: all .3s ease;
    }
    .fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .fade-enter, .fade-leave-active {
    transform: translateY(-10px);
    opacity: 0;
    }
</style>