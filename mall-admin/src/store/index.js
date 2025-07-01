import Vue from 'vue';
import Vuex from 'vuex';
import { getAdminInfoFromCookie, setAdminInfoToCookie, removeAdminInfoFromCookie } from '@/utils/cookie';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    adminInfo: getAdminInfoFromCookie() || null
  },
  mutations: {
    setAdminInfo(state, adminInfo) {
      state.adminInfo = adminInfo;
      setAdminInfoToCookie(adminInfo);
    },
    clearAdminInfo(state) {
      state.adminInfo = null;
      removeAdminInfoFromCookie();
    }
  },
  actions: {},
  modules: {}
}); 