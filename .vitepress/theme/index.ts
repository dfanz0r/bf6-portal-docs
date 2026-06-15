import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PortalLogo from './PortalLogo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-title-before': () => h(PortalLogo)
  })
}
