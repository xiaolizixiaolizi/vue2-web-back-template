import Layout from '@/layout'

export default {
    path: '/attendance',
    component: Layout,
    children: [{
        path: '',
        name: 'attendance',
        component: () => import('@/views/attendance'),
        meta: { title: '考勤', icon: 'dashboard' }
    }]
}