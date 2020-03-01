import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'  
import VueAxios from 'vue-axios'

axios.interceptors.request.use(config => {
	if (/get/i.test(config.method)) { //判断get请求
		config.params  =  config.params || {};
		config.params.t = Date.parse(new Date())/1000; //添加时间戳
	}
    return config;
}, error => {
    return Promise.reject(error);
})


Vue.use(VueAxios,axios);	

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
