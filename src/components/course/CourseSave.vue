<template lang="html">
<div class="course-save">
    <div class="course-channel">
        <div class="channel-block">
            <div class="channel-list">
                <span v-on:click="chooseCat(0)" v-bind:class="['channel-item', catid === 0 ? 'channel-choosed': '']">全部</span>
                <span v-on:click="chooseCat(category.catid)" v-for="category in defaultCategoryList" v-bind:class="['channel-item', catid === category.catid ? 'channel-choosed': '']">{{category.catName}}</span>
            </div>
        </div>
        <div class="channel-add" @click="toChannel">+</div>
    </div>
    <div v-show="saveVideoList.length != 0"
        class="course-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="100">
        <div v-for="saveVideo in saveVideoList" class="course-item" @click="link(saveVideo.vdoid)">
            <div class="course-img">
                <img  v-lazy="saveVideo.coverpicUrl" alt="">
                <div class="course-teacher">
                    <span>{{saveVideo.proName}}</span>
                    <span>{{saveVideo.proTitle}}</span>
                </div>
            </div>
            <div class="course-info">
                <h5>{{saveVideo.title}}</h5>
                <p>{{saveVideo.proOrg}}</p>
            </div>
        </div>
    </div>
    <div v-show="saveVideoList.length == 0" class="seat-img">
        <img src="../../assets/images/relevent_pinglun@3x.png">
    </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import { InfiniteScroll } from 'mint-ui'
import {api} from '../../utils/api'
export default {
    data () {
        return {
            defaultCategoryList: [],
            catid: 0,
            saveVideoList: [],
            loading: false,
            start: 0,
            limit: 10
        }
    },
    created () {
        this.getDefaultCategoryList()
    },
    computed: {
        uid () {
            return this.$store.getters.uid
        }
    },
    methods: {
        ...mapMutations([
            'showLoad','hideLoad'
        ]),
        getDefaultCategoryList () {
            var _this = this
            const uid = this.uid
            api(uid,
                {srv: "video_video",cmd: "get_new_category_list"},
                {}
            )
            .then(function (response) {
                _this.defaultCategoryList = response.data.rsps[0].body.cats
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        getSaveVideoList (catid) {
            var _this = this
            const uid = this.uid
            var catids = 0
            if (catid === 0) {
                catids = []
            } else {
                catids = [catid]
            }
            api(uid, {
                    srv: "video_video",
                    cmd: "get_new_save_video_list"
                },
                {
                start: _this.start,
                limit: _this.limit,
                catids: catids
                }
            )
            .then(function (response) {
                let data = response.data
                if (data.result == 0) {
                    _this.saveVideoList = _this.saveVideoList.concat(data.rsps[0].body.videos)
                    if (_this.start === 0) {
                        _this.hideLoad()
                    }
                    if (data.rsps[0].body.is_end) {
                        _this.loading = true
                    }else{
                        _this.loading = false
                    }
                    _this.start += _this.limit
                }else{
                    _this.toast(data.msg)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        chooseCat (catid) {
            this.catid = catid
            this.start = 0
            this.saveVideoList = []
            this.getSaveVideoList(catid)
        },
        loadMore () {
            // this.loading = true
            this.getSaveVideoList(this.catid)
        },
        link (id) {
            this.showLoad()
            this.$router.push({name:'CourseDetailSave', params:{ vdoid:id }})
        },
        toChannel () {
            this.$router.push({path:'Channel'})
        }
    },
    directives: {
        InfiniteScroll: InfiniteScroll
    }
}
</script>

<style lang="less" scoped>

.course-save {
    background: #eee;
    padding-top: 40px;
    min-height:  80vh;
    .course-channel {
        position: fixed;
        top: 47px;
        left: 0;
        right: 0;
        width: 100%;
        background: #fff;
        z-index: 100;
        .channel-block {
            // margin-right: 45px;
            height: 50px;
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
            &::-webkit-scrollbar {
                display: none !important;
            }
        }
        .channel-list {
            font-size: 14px;
            display: flex;
            flex-wrap: nowrap;
            height: 100%;
            padding-right: 50px;
            align-content: stretch;
            .channel-item {
                padding: 0 10px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                border-bottom: 2px solid transparent;
            }
            .channel-choosed {
                border-bottom: 2px solid #d93639;
                color: #d93639;
                transition: all .5s linear;
            }
        }
        .channel-add {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 45px;
            font-weight: bolder;
            font-size: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 -1px 5px 0 #ccc;
            background: #fff;
        }
    }
    .course-list {
        padding: 10px 10px 60px 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .course-item {
            flex: 0 0 49%;
            display: flex;
            flex-direction: column;
            margin-top: 10px;
            .course-img {
                position: relative;
                height: e("calc(49vw / 2)");
                overflow: hidden;
                .course-teacher {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    color: #fff;
                    padding: 3px;
                    text-align: left;
                }
            }
            img {
                width: 100%;
            }
            .course-info {
                flex-grow: 1;
                background: #fff;
                overflow: hidden;
                text-align: left;
                display: flex;
                flex-direction: column;
                justify-content: center;
                h5 {
                    margin: 5px 4px;
                }
                p {
                    margin: 5px 4px;
                }
            }
        }
    }
}
.seat-img{
    img{
        margin-top: 100px;
        width: 40%;
    }
}
</style>
