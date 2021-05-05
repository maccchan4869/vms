import { createStore } from 'vuex'
import firebase from 'firebase'

export default createStore({
  state: {
    loginUser: {
      uid: '',
      staffName: '',
      admin: false
    },
    vacationInfo: {
      applyStartDay: null,
      applyEndDay: null,
      vacationDays: 0,
      remainingVacationDays: 0,
    },
    vacation: [],
    expense: [],
    staffs: []
  },
  mutations: {
    commitLoginUser(state, val) {
      state.loginUser = val;
    },
    commitVacationInfo(state, val) {
      state.vacationInfo = val;
    },
    commitVacation(state, val) {
      state.vacation = val;
    },
    commitStaffs(state, val) {
      state.staffs = val;
      
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
    },

    // 休暇情報を取得
    async getVacationInfo({ commit }) {
      try {
        const uid = firebase.auth().currentUser.uid;
        const infoRef = await firebase.firestore().collection('information').doc(uid).collection('year')
          .orderBy('year', 'desc').limit(1).get();
        infoRef.forEach(infoDoc => {
          commit('commitVacationInfo', {
            applyStartDay: infoDoc.get('applyStartDay').toDate(),
            applyEndDay: infoDoc.get('applyEndDay').toDate(),
            vacationDays: infoDoc.get('vacationDays'),
            remainingVacationDays: infoDoc.get('remainingVacationDays')
          });
        });
      } catch (error) {
        throw error.message;
      }
    },

    // 休暇申請情報を取得
    async getVacation({ commit }) {
      try {
        const uid = firebase.auth().currentUser.uid;
        const vacationRef = await firebase.firestore().collection('vacation').doc(uid).collection('serialNo').get();
        const vacation = [];
        vacationRef.forEach(vacationDoc => {
          vacation.push({
            serialNo: vacationDoc.get('serialNo'),
            applyStatusCd: vacationDoc.get('applyStatusCd'),
            typeCd: vacationDoc.get('typeCd'),
            startDatetime: vacationDoc.get('startDatetime').toDate(),
            endDatetime: vacationDoc.get('endDatetime').toDate(),
            memo: vacationDoc.get('memo'),
          });
        });
        commit('commitVacation', vacation);
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
    },
    getVacation: state => {
      return state.vacation;
    },
    getVacationInfo: state => {
      return state.vacationInfo;
    }
  }
})
