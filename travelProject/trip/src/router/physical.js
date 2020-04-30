export const physical = [{
    path: '/physicalList',
    name: 'physicalList',
    meta: {
        parentName: 'physical',
    },
    component: () => import('../views/physical/list.vue')
}, {
    path: '/physicalEdit',
    name: 'physicalEdit',
    meta: {
        parentName: 'physical',
    },
    component: () => import('../views/physical/edit.vue')
}, {
    path: '/physicalDetail',
    name: 'physicalDetail',
    meta: {
        parentName: 'physical',
    },
    component: () => import('../views/physical/detail.vue')
}]