// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { FakeQQUI } from "fake-qq-ui";

import QWindow from "../components/QWindow.vue";

import '../styles/index.scss'
import 'fake-qq-ui/styles/fake-qq-ui.css'
import 'fake-qq-ui/styles/light.scss'
import 'fake-qq-ui/styles/dark.scss'


export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('QWindow', QWindow)
    app.use(FakeQQUI)
  }
} satisfies Theme
