import { createStore } from 'vuex'
import firebase from 'firebase'
import definition from "@/helper/definition"

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
    async login({ commit, dispatch }, {email, password}) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        const uid = firebase.auth().currentUser.uid;
        const userDoc = await firebase.firestore().collection('users').doc(uid).get();
        commit('commitLoginUser', {
          uid: userDoc.get('uid'),
          staffName: userDoc.get('staffName'),
          admin: userDoc.get('admin'),
          daysLeft: userDoc.get('daysLeft')
        });
        await dispatch('getStaffList', uid);
      } catch (error) {
        throw error.message;
      }
    },

    // 新規登録
    async registerAccount({ dispatch }, item) {
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
          admin: item.admin,
          daysLeft: 0
        });
        await dispatch('getStaffList', uid);
      } catch (error) {
        throw error.message;
      }
    },

    // アカウント削除
    async deleteAccount({ dispatch }, deleteUid) {
      try {
        // TODO：Authenticationの削除は手動でしか対応不可
        const loginUid = this.getters.getLoginUser.uid;
        const vacationRef = await firebase.firestore().collection('vacation').doc(deleteUid).collection('vacationId').get();
        vacationRef.forEach(async vacationDoc => {
          await firebase.firestore().collection('vacation').doc(deleteUid).collection('vacationId').doc(vacationDoc.get('vacationId')).delete();
          await firebase.firestore().collection('vacation').doc(vacationDoc.get('vacationId')).delete();
        });
        await firebase.firestore().collection('vacation').doc(deleteUid).delete();
        await firebase.firestore().collection('users').doc(deleteUid).delete();
        await dispatch('getStaffList', loginUid);
      } catch (error) {
        throw error.message;
      }
    },

    // アカウント編集
    async editAccount({ dispatch }, {targetUid, changedDaysLeft}){
      const db = firebase.firestore();
      const loginUid = this.getters.getLoginUser.uid;
      try {
        await db.collection('users').doc(targetUid).update({
          daysLeft: firebase.firestore.FieldValue.increment(changedDaysLeft)
        });
        await dispatch('getStaffList', loginUid);
      } catch (error) {
        console.error(error.message);
      }
    },

    // スタッフ一覧を取得
    async getStaffList( {commit}, loginUid) {
      try {
        const staffs = [];
        const users = await firebase.firestore().collection('users').get();
        users.forEach((userDoc) => {
          const uid = userDoc.get('uid');
          if (uid === loginUid) return;
          // 残有給休暇日数を取得
          staffs.push({
            uid: uid,
            staffName: userDoc.get('staffName'), 
            email: userDoc.get('email'),
            joiningDate: userDoc.get('joiningDate').toDate(),
            firstSupplyHolidays: userDoc.get('firstSupplyHolidays').toDate(),
            admin: userDoc.get('admin'),
            daysLeft: userDoc.get('daysLeft')
          });
        });
        commit('commitStaffs', staffs);
      } catch (error) {
        throw error.message;
      }
    },

    // 休暇情報を取得
    async getVacationInfo({ commit }) {
      try {
        const uid = this.getters.getLoginUser.uid;
        const infoRef = await firebase.firestore().collection('information').doc(uid).collection('year')
          .orderBy('year', 'desc').limit(1).get();
        infoRef.forEach(infoDoc => {
          commit('commitVacationInfo', {
            applyStartDay: infoDoc.get('applyStartDay').toDate(),
            applyEndDay: infoDoc.get('applyEndDay').toDate(),
            supplyVacationDays: infoDoc.get('supplyVacationDays')
          });
        });
      } catch (error) {
        throw error.message;
      }
    },

    // 休暇申請情報を取得(スタッフの場合)
    async getVacation({ commit }) {
      try {
        const uid = this.getters.getLoginUser.uid;
        const vacationRef = await firebase.firestore().collection('vacation').doc(uid).collection('vacationId').get();
        const vacation = [];
        vacationRef.forEach(vacationDoc => {
          vacation.push({
            vacationId: vacationDoc.get('vacationId'),
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
    },

    // 休暇申請情報を取得(管理者の場合)
    async getVacationList({ commit }, {year, targetUid}) {
      try {
        let vacationRef = null;
        if (targetUid) {
          vacationRef = await firebase.firestore().collection('vacation').where("year", "==", year).where("uid", "==", targetUid).orderBy('startDatetime').get();
        } else {
          vacationRef = await firebase.firestore().collection('vacation').where("year", "==", year).orderBy('startDatetime').get();
        }
        const vacation = [];
        vacationRef.forEach(vacationDoc => {
          vacation.push({
            uid: vacationDoc.get('uid'),
            staffName: vacationDoc.get('staffName'),
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
    },

    // 休暇申請
    async applyVacation({ dispatch }, item) {
      try {
        const user = this.getters.getLoginUser;
        const thisYear = definition.getThisYear();
        const docRef = await firebase.firestore().collection('vacation').add({
          uid: user.uid,
          year: thisYear,
          staffName: user.staffName,
          startDatetime: item.startDatetime,
          endDatetime: item.endDatetime,
          typeCd: item.typeCd,
          applyStatusCd: item.applyStatusCd,
          memo: item.memo
        });
        firebase.firestore().collection('vacation').doc(user.uid).collection('vacationId').doc(docRef.id).set({
          uid: user.uid,
          vacationId: docRef.id,
          startDatetime: item.startDatetime,
          endDatetime: item.endDatetime,
          typeCd: item.typeCd,
          applyStatusCd: item.applyStatusCd,
          memo: item.memo
        });
        await dispatch('getVacation');
      } catch (error) {
        throw error.message;
      }
    },

    // 休暇申請取消
    async cancelVacation({ dispatch }, item) {
      try {
        const uid = this.getters.getLoginUser.uid;
        await firebase.firestore().collection('vacation').doc(uid).collection('vacationId').doc(String(item.vacationId)).delete();
        await firebase.firestore().collection('vacation').doc(item.vacationId).delete();
        dispatch('getVacation');
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
    },
    getStaffs: state => {
      return state.staffs;
    }
  }
})
