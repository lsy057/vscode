import Vue from 'vue'
import App from './app.vue'
import './assets/styles/test.css'
import './assets/images/background-image.jpg'
import './assets/styles/test-styl.styl'
import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)
new Vue({
  render: (h) => h(App)
}).$mount(root)
