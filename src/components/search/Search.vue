<template>
	<div class="search">
		<header class="search-head flex justify-space-between">
			<iframe id="sub_frame" name="sub_frame" width="0" height="0" style="display:none;"></iframe>
			<div class="head-input flex align-items-center">
				<img src="../../assets/images/search.png" alt="">
				<form target="sub_frame">
					<input type="search" v-on:input="search"  placeholder="搜索视频" v-model="searchWord" v-on:search="recordSearch">
                </form>
			</div>
			<button type="button" name="button" @click="recordSearch">搜索</button>
		</header>
        <div v-show="!showResult || showTip">
            <div class="search-part hot">
                <h5>热门搜索</h5>
                <ul class="hot-list">
                    <li v-for="h in hotSearch" @click="searchHot(h)">{{h}}</li>
                </ul>
            </div>
            <div class="search-part history" v-if="historySearch.length != 0">
                <h5>历史搜索</h5>
                <ul class="history-list">
                    <li v-for="(h,i) in historySearch" @click="searchHistory(h)">
                        <i class="icon icon-time"></i>
                        {{h}}
                        <span class="delete-icon" @click.stop="delHistory(i)">×</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="root" v-show="showResult && !showTip">
            <div class="search-result" v-show="searchVideos.length !== 0">
                <h5>视频</h5>
                <ul>
                    <li v-for="v in searchVideos" @click="link(v.vdoid)">
                        <section class="flex">
                            <div>
                                <img :src="v.coverpicUrl">
                            </div>
                            <div class="flex flex-direction-column justify-space-between">
                                <p class="text-overflow" v-html="v.title"></p>
                                <p class="text-overflow" v-html="v.content"></p>
                            </div>
                        </section>
                    </li>
                     <div class="more" @click="loadMore">
                       {{is_end?'没有更多了':' 更多视频 >'}}
                    </div> 
                </ul>
            </div>
            <div class="seat" v-show="searchVideos.length === 0 && showResult">
                <img src="../../assets/images/seat_topic.png">
                <p>暂无视频</p>
            </div>
        </div>
	</div>
</template>
<script>
import { mapMutations,mapGetters } from 'vuex'
import { throttle } from '../../utils/func'
import { api } from '../../utils/api'
import ls from 'storejs'
export default {
    name:'Search',
    created () {
        this.hideLoad()
        this.getHotSearch()
        var history = ls.get('histroy')
        // console.log(history)
        this.historySearch = JSON.parse(history).slice(0,5)
    },
    components:{
        // Loadmore
    },
    data () {
        return {
            searchWord:'',
            searchRes: 0, // 0搜索前，1有结果，2没结果
            hotSearch:[],
            historySearch:[],
            searchVideos:[],
            showResult:false,
            start:0,
            limit:10,
            is_end:false
        }
    },
    methods: {
        ...mapMutations([
            'hideLoad','showLod'
        ]),
        search:throttle(function(){
            this.is_end = false
            api(this.uid,{srv: "article_article",cmd: "search_list"},{content:this.searchWord})
            .then(res=>{
                res = res.data
                if (res.result != 0) {
                    this.toast(res.msg)
                }else{
                    this.showResult = true
                    let videos = res.rsps[0].body.videos
                    if(videos.length > 0){
                        // console.log(videos)
                        videos.forEach(item=>{
                            item.title=item.title.replace(this.searchWord,'<span class="red">' + this.searchWord + '</span>')
                            item.content=item.content.replace(this.searchWord,'<span class="red">' + this.searchWord + '</span>')
                        })
                        // console.log(videos)
                    }
                    this.searchVideos = videos
                }
           })
        },1000,1000),
        recordSearch () {
            var word = this.searchWord
            if(word){
                let arr = ls.get('histroy')
                if (this.historySearch.indexOf(word) < 0) {
                    this.historySearch.unshift(word)
                }
            }
            if(this.historySearch.length != 0){
                ls.set('histroy',JSON.stringify(this.historySearch))
            }
        },
        getHotSearch () {
            api(this.uid,{ srv: "article_article",cmd: "get_hot_search"},{})
            .then(res=>{
                res = res.data
                if (res.result != 0) {
                    this.toast(res.msg)
                }else{
                    this.hotSearch = res.rsps[0].body.hotList.slice(0,8)
                }
            })
        },
        loadMore () {
            if(this.is_end) return
            api(this.uid,{ srv: "video_video",cmd: "search_video_list"},{
                flag:1,
                start:this.start,
                limit:this.limit,
                content:this.searchWord
            })
            .then(res=>{
                res = res.data
                if(res.result !=0 ){
                    this.toast(res.msg)
                }else{
                    this.start+=this.limit
                    let videos = res.rsps[0].body.videos
                    if(videos.length > 0){
                        videos.forEach(item=>{
                            item.title=item.title.replace(this.searchWord,'<span class="red">' + this.searchWord + '</span>')
                            item.content=item.content.replace(this.searchWord,'<span class="red">' + this.searchWord + '</span>')
                        })
                        // console.log(videos)
                    }
                    this.searchVideos = this.searchVideos.concat(videos)
                    this.is_end = res.rsps[0].body.is_end
                }
            })
        },
        searchHistory (h) {
            this.searchWord = h
            this.search()
        },
        searchHot (h) {
            this.searchWord = h
            this.search()
        },
        delHistory (index) {
            // alert(index)
            this.historySearch.splice(index,1)
            ls.set('histroy',JSON.stringify(this.historySearch))
        },
        link (id) {
            this.$router.push({name:'CourseDetailSave',params:{vdoid:id}})
        }
    },
    computed: {
        ...mapGetters(['uid']),
        showTip () {
            return this.searchWord === ''
        }
    }
}
</script>
<style lang="less">
.search{
    background-color: #f2f2f2;
    min-height:100vh;
    min-height:100%;
}
.search-head {
    padding: 5px 10px;
    background: #d93639;
    height: 30px;
    .head-input {
        flex-shrink: 0;
    }
    .head-input {
        background: #fff;
        border-radius: 5px;
        flex-grow: 99;
        margin-right: 10px;
        img {
            width: 15px;
            height: 15px;
            margin-left: 10px;
        }
        form {
            flex-grow: 99;
            flex-shrink: 0;
        }
        input {
            width: 100%;
            border: 0;
            box-sizing: border-box;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            padding: 0 5px;
            outline: none;
        }
    }
    button {
        background: #c22529;
        color: #fff;
        border: 1px solid #b12125;
        border-radius: 5px;
        width: 50px;
        box-sizing: border-box;
        font-size: 12px;
        padding: 0;
       outline: none;
    }
}
.search-part{
    padding-left: 15px;
    h5{
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        color: #666;
        margin: 17px 0 15px;
    }
    .hot-list{
        text-align: left;
        li{
            height: 30px;
            line-height: 30px;
            border-radius: 15px;
            padding: 0 12px;
            margin: 5px;
            color: #333;
            text-align: center;
            font-size: 15px;
            border: 1px solid #d3d3d3;
            width: auto;
            display: inline-block;
        }
    }
    .history-list{
        padding-left: 15px;
        li{
            height: 45px;
            text-align: left;
            line-height: 45px;
            font-size: 15px;
            border-bottom: 1px solid #e2e2e2;
            position: relative;
            padding-left: 24px;
           color: #333;
            .icon{
                position: absolute;
               left:0;
               font-size:26px;
               color:#999;
               margin-right:15px;
            }
          .delete-icon{
            position: absolute;
            right:0;
            font-size:26px;
            color:#999;
            margin-right:15px;
            font-weight: 300;
          }
            .icon-time{
                background-image: url(../../assets/images/time.png);
                top: 10px;
                left: -5px;
            }
            .icon-del{
                font-style:normal;
                font-size: 22px;
                right: 15px;
                color: #666;
                top: -3px;
            }
        }
    }
}
.search-result {
    background-color: #fff;
    >h5{
        font-size: 16px;
        color: #666;
        margin: 0;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        text-align: left;
        font-weight: normal;
        border-bottom: 1px solid #e2e2e2;
    }
    section{
        padding: 8px 12px;
        border-bottom: 1px solid #e2e2e2;
        min-height: 50px;
        >div:nth-child(1){
            width: 30%;
            min-height: 50px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        >div:nth-child(2){
            width: 70%;
            >:first-child{
                text-align: left;
                padding-left: 10px;
                color: #333;
                font-size: 14px;
            }
            >:last-child{
                color: #999;
                padding-left: 10px;
                font-size: 12px;
                text-align: left;
                margin-bottom: 5px;
                width: 100%;
                span{
                    display: inline-block;
                    margin: 0 10px;
                }
            }
        }
    }
}
.red{
    color: #d93639;
}
.more{
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    font-size: 16px;color: #666;text-align: left;
}
</style>
