import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import getters from './getter'
import actions from './action'
import mutations from './mutation'
import state from './state'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user
  },
  getters,
  actions,
  mutations,
  state
})

export default store
