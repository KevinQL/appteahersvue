import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import TeacherList from '../components/TeacherList.vue'
import TeacherForm from '../components/TeacherForm.vue'
import CourseList from '../components/CourseList.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'teachers',
        name: 'Teachers',
        component: TeacherList
      },
      {
        path: 'teachers/new',
        name: 'NewTeacher',
        component: TeacherForm
      },
      {
        path: 'courses',
        name: 'Courses',
        component: CourseList
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardia de navegación para verificar autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 