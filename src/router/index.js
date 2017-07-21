import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'


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

const Search = resolve => {
  require(['src/components/search/Search'],resolve)
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
  require(['src/components/studio/Studio'], resolve)
}

const studioList = resolve => {
  require(['src/components/studio/StudioList'], resolve)
}

const SubjectIntro = resolve => {
  require(['src/components/subject/SubjectIntro'], resolve)
}

const Subject = resolve => {
  require(['src/components/subject/Subject'], resolve)
}

const Discuss = resolve => {
  require(['src/components/subject/Discuss'], resolve)
}

const WatchedSubjects = resolve => {
  require(['src/components/studio/WatchedSubjects'], resolve)
}



export default new Router({
  routes: [
    {
      path: '/',
      name:'Course',
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
      component:CourseDetailLive,
      meta:{hideTab:true}
    },
    {
      path:'/CourseDetailSave/:vdoid',
      name:'CourseDetailSave',
      component:CourseDetailSave,
      meta:{requiresAuth:true,hideTab:true}
    },
    {
      path:'/Search',
      name:'Search',
      component:Search,
      meta:{hideTab:true}
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
      component:Setting,
      meta:{hideTab:true}
    },
    {
      path:'/Auth',
      component:Auth,
      meta:{hideTab:true}
    },
    {
      path:'/UpAuthImg',
      component:UpAuthImg
    },
    {
      path:'/Studio',
      component:Studio,
      meta:{hideTab:true}
    },
    {
      path:'/SubjectIntro',
      component:SubjectIntro,
      meta:{hideTab:true}
    },
    {
      path:'/Subject',
      component:Subject,
      name:'Subject',
      meta:{hideTab:true,keepalive:true}
    },
    {
      path:'/StudioList',
      component:studioList,
      meta:{hideTab:true}
    },
    {
      path:'/WatchedSubjects',
      component:WatchedSubjects,
      meta:{hideTab:true}
    },
    {
      path:'/Discuss',
      name:'Discuss',
      component:Discuss,
      meta:{hideTab:true,keepalive:true}
    }
  ]
})
