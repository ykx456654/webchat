import Vue from 'vue'
import Router from 'vue-router'



Vue.use(Router)

const Course = resolve => {
	require(['src/components/course/Course.vue'],resolve)
}
const CourseLive = resolve => {
	require(['src/components/course/CourseLive.vue'],resolve)
}
const CourseSave = resolve => {
	require(['src/components/course/CourseSave.vue'],resolve)
}

const CourseDetailLive = resolve => {
  require(['src/components/course/courseDetail/CourseDetailLive'],resolve)
}

const CourseDetailSave = resolve => {
  require(['src/components/course/courseDetail/CourseDetailSave'],resolve)
}

const SearchVideo = resolve => {
  require(['src/components/search/SearchVideo'],resolve)
}

const Channel = resolve => {
  require(['src/components/course/Channel'],resolve)
}

const Recommond = resolve => {
  require(['src/components/recommond/Recommond'],resolve)
}

const Me = resolve => {
  require(['src/components/me/Me'],resolve)
}


const Setting = resolve => {
  require(['src/components/me/Setting'], resolve)
}

const Auth = resolve => {
  require(['src/components/me/Auth'], resolve)
}

const UpAuthImg = resolve => {
  require(['src/components/me/UpAuthImg'], resolve)
}

const Studio = resolve => {
  require(['src/components/studio/Studio.vue'], resolve)
}









export default new Router({
  routes: [
    {
      path: '/',
      component: Course,
      children:[
      	{
      		path:'/',
      		component:CourseLive
      	},
      	{
      		path: 'CourseLive',
      		component:CourseLive
      	},
      	{
      		path: 'CourseSave',
      		component:CourseSave
      	}
      ]
    },
    {
      path:'/CourseDetailLive/:vdoid',
      name:'CourseDetailLive',
      component:CourseDetailLive
    },
    {
      path:'/CourseDetailSave/:vdoid',
      name:'CourseDetailSave',
      component:CourseDetailSave,
      meta:{requiresAuth:true}
    },
    {
      path:'/SearchVideo',
      component:SearchVideo
    },
    {
      path:'/Channel',
      component:Channel
    },
    {
      path:'/Recommond',
      component:Recommond
    },
    {
      path:'/Me',
      component:Me,
      meta:{requiresAuth:true}
    },
    {
      path:'/Setting',
      component:Setting
    },
    {
      path:'/Auth',
      component:Auth
    },
    {
      path:'/UpAuthImg',
      component:UpAuthImg
    },
    {
      path:'/Studio',
      component:Studio,
      meta:{hideTab:true}
    }
  ]
})
