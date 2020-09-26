import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		islogin: false,
		user: ''
	},
	mutations: {
		updateIsLogin(state,flag) {
			state.islogin = flag
		},
		user(state,username) {
			state.user = username
		}
	},
	actions: {
		
	},
	modules: {
	  
	}
})
