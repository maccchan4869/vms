import { createStore } from 'vuex'
import firebase from 'firebase'

export default createStore({
  state: {
    loginUser: {
      uid: '',
      staffName: '',
      admin: false
    },
    staffs: []
  },
  mutations: {
    commitLoginUser(state, val) {
      state.loginUser = val;
    },
    commitStaffs(state, val) {
      state.loginUser = val;
    },
  },
  actions: {
    // ログイン
    async login({ commit }, {email, password}) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        const uid = firebase.auth().currentUser.uid;
        const userDoc = await firebase.firestore().collection('users').doc(uid).get();
        commit('commitLoginUser', {
          uid: userDoc.get('uid'),
          staffName: userDoc.get('staffName'),
          admin: userDoc.get('admin')
        });
      } catch (error) {
        throw error.message;
      }
    },

    // 新規登録
    async registerAccount({ commit }, item) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(item.email, item.password);
        const uid = firebase.auth().currentUser.uid;
        // 月は0開始なので-1する
        item.joiningDate.month -= 1;
        const dt = new Date(item.joiningDate.year, item.joiningDate.month, item.joiningDate.day);
        dt.setMonth(dt.getMonth() + 6);
        firebase.firestore().collection('users').doc(uid).set({
          uid: uid,
          staffName: item.staffName,
          email: item.email,
          joiningDate: new Date(item.joiningDate.year, item.joiningDate.month, item.joiningDate.day),
          firstSupplyHolidays: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()),
          admin: item.admin
        });
        const staffs = [];
        const users = await firebase.firestore().collection('users').get();
        users.forEach((userDoc) => {
          staffs.push({
            uid: userDoc.get('uid'), 
            staffName: userDoc.get('staffName'), 
            email: userDoc.get('email'),
            joiningDate: userDoc.get('joiningDate').toDate(),
            firstSupplyHolidays: userDoc.get('firstSupplyHolidays').toDate(),
            admin: userDoc.get('admin'),
          })
        });
        commit('commitStaffs', staffs);
      } catch (error) {
        throw error.message;
      }
    }
  },
  modules: {
  },
  getters: {
    getLoginUser: state => {
      return state.loginUser;
    }
  }
})
