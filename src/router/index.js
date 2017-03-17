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
  require(['src/components/courseDetail/CourseDetailLive'],resolve)
}

const CourseDetailSave = resolve => {
  require(['src/components/courseDetail/CourseDetailSave'],resolve)
}

const SearchVideo = resolve => {
  require(['src/components/search/SearchVideo'],resolve)
}

const Channel = resolve => {
  require(['src/components/course/Channel'],resolve)
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
      ],
      meta:{requiresAuth:true}
    },
    {
      path:'/CourseDetailLive',
      component:CourseDetailLive
    },
    {
      path:'/CourseDetailSave',
      component:CourseDetailSave
    },
    {
      path:'/SearchVideo',
      component:SearchVideo
    },
    {
      path:'/Channel',
      component:Channel
    }
  ]
})
