import Vue from 'vue'
import SvgIcon from '@/components/svg-icon'
Vue.component('svg-icon', SvgIcon)

/**
 * 下面这段代码的作用类似于:
 require('./svg/clock.svg')
 require('./svg/menu-today-member.svg')
 require('./svg/menu-member.svg')
 .
 .
 .
 */
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
