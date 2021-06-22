import { createStore } from 'vuex'
import firebase from 'firebase'
import definition from '@/helper/definition'
import mail from '@/helper/mail'
import createPersistedState from 'vuex-persistedstate'

const initState = {
  loginUser: {
    uid: '',
    staffName: '',
    admin: false
  },
  vacation: [],
  expenses: [],
  staffs: [],
  mailingList: [],
  imageUrl: ''
}

export default createStore({
  state: initState,
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
    commitExpenses(state, val) {
      state.expenses = val; 
    },
    commitImageUrl(state, val) {
      state.imageUrl = val;
    },
    commitMailingList(state, val) {
      state.mailingList = val;
    },
  },
  actions: {
    // ログイン
    async login({ dispatch }, {email, password}) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        const uid = firebase.auth().currentUser.uid;
        await dispatch('getStaff', uid);
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
          addVacationDay: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()),
          admin: item.admin,
          daysLeft: 0
        });
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        await dispatch('login', {
          email: email,
          password: password
        });
      } catch (error) {
        throw error.message;
      }
    },

    // アカウント削除
    async deleteAccount({ dispatch }, deleteUid) {
      // TODO：Authenticationの削除は手動でしか対応不可
      try {
        const db = firebase.firestore();
        const loginUid = this.getters.getLoginUser.uid;

        // 休暇申請情報削除
        const vacationRef = await db.collection('vacation').doc(deleteUid).collection('vacationId').get();
        vacationRef.forEach(async vacationDoc => {
          const vacationId = vacationDoc.get('vacationId');
          await db.collection('vacation').doc(deleteUid).collection('vacationId').doc(vacationId).delete();
          await db.collection('vacation').doc(vacationId).delete();
        });
        await db.collection('vacation').doc(deleteUid).delete();

        // 経費申請情報削除
        const expensesRef = await db.collection('expenses').doc(deleteUid).collection('expensesId').get();
        expensesRef.forEach(async expensesDoc => {
          const expensesId = expensesDoc.get('expensesId');
          await db.collection('expenses').doc(deleteUid).collection('expensesId').doc(expensesId).delete();
          await db.collection('expenses').doc(expensesId).delete();
          await firebase.storage().ref().child(`images/${deleteUid}/${expensesId}.jpg`).delete();
        });
        await db.collection('expenses').doc(deleteUid).delete();

        // ユーザー情報削除
        await db.collection('users').doc(deleteUid).delete();

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

    // スタッフを取得
    async getStaff( {commit}, loginUid) {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(loginUid).get();
        commit('commitLoginUser', {
          uid: userDoc.get('uid'),
          staffName: userDoc.get('staffName'),
          admin: userDoc.get('admin'),
          daysLeft: userDoc.get('daysLeft')
        });
      } catch (error) {
        throw error.message;
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
            addVacationDay: userDoc.get('addVacationDay').toDate(),
            admin: userDoc.get('admin'),
            daysLeft: userDoc.get('daysLeft')
          });
        });
        commit('commitStaffs', staffs);
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
          vacationRef = await firebase.firestore().collection('vacation').where('year', '==', year).where('uid', '==', targetUid).orderBy('startDatetime').get();
        } else {
          vacationRef = await firebase.firestore().collection('vacation').where('year', '==', year).orderBy('startDatetime').get();
        }
        const vacation = [];
        vacationRef.forEach(vacationDoc => {
          vacation.push({
            uid: vacationDoc.get('uid'),
            vacationId: vacationDoc.get('vacationId'),
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
      const db = firebase.firestore();
      try {
        const user = this.getters.getLoginUser;
        const thisYear = definition.getThisYear();
        const docRef = await db.collection('vacation').add({});
        await db.collection('vacation').doc(docRef.id).set({
          uid: user.uid,
          vacationId: docRef.id,
          year: thisYear,
          staffName: user.staffName,
          startDatetime: item.startDatetime,
          endDatetime: item.endDatetime,
          typeCd: item.typeCd,
          applyStatusCd: item.applyStatusCd,
          memo: item.memo,
          reason: ''
        });
        await db.collection('vacation').doc(user.uid).collection('vacationId').doc(docRef.id).set({
          uid: user.uid,
          vacationId: docRef.id,
          startDatetime: item.startDatetime,
          endDatetime: item.endDatetime,
          typeCd: item.typeCd,
          applyStatusCd: item.applyStatusCd,
          memo: item.memo,
          reason: ''
        });
        await db.collection('users').doc(user.uid).update({
          daysLeft: firebase.firestore.FieldValue.increment(-item.vacationDays)
        });
        await dispatch('getStaff', user.uid);
        await dispatch('getVacation');
        const mailInfo = {
          destinations: this.getters.getMailingList,
          subject: '休暇申請がありました',
          text: `${user.staffName}から休暇申請が届きました。`
        };
        mail.sendMailToAdministrator(mailInfo);
      } catch (error) {
        throw error.message;
      }
    },

    // 休暇申請取消
    async cancelVacation({ dispatch }, item) {
      try {
        const db = firebase.firestore();
        const staffName = this.getters.getLoginUser.staffName;
        const uid = this.getters.getLoginUser.uid;
        const vacationDoc = await db.collection('vacation').doc(uid).collection('vacationId').doc(item.vacationId).get();
        const startDatetime = vacationDoc.get('startDatetime').toDate();
        const endDatetime = vacationDoc.get('endDatetime').toDate();
        const vacationDays = definition.getVacationDays(startDatetime, endDatetime);
        await db.collection('vacation').doc(uid).collection('vacationId').doc(item.vacationId).delete();
        await db.collection('vacation').doc(item.vacationId).delete();
        await db.collection('users').doc(uid).update({
          daysLeft: firebase.firestore.FieldValue.increment(vacationDays)
        });
        await dispatch('getVacation');
        const mailInfo = {
          destinations: this.getters.getMailingList,
          subject: '休暇申請取消が行われました',
          text: `${staffName}が休暇申請を取消しました。`
        };
        mail.sendMailToAdministrator(mailInfo);
      } catch (error) {
        throw error.message;
      }
    },

    // 休暇申請承認,却下
    async changeVacationStatusCd({ dispatch }, {targetUid, vacationId, statusCd, reason}) {
      try {
        // ステータスを更新
        const db = firebase.firestore();
        const batch = db.batch();
        const vacRef = db.collection('vacation').doc(targetUid).collection('vacationId').doc(vacationId);
        const vacListRef = db.collection('vacation').doc(vacationId);
        batch.update(vacRef, {'applyStatusCd': statusCd});
        batch.update(vacRef, {'reason': reason});
        batch.update(vacListRef, {'applyStatusCd': statusCd});
        batch.update(vacListRef, {'reason': reason});
        await batch.commit();
        await dispatch('getVacationList' , {
          year: definition.getThisYear(),
          targetUid: targetUid
        });

        // 承認、却下結果をメール送信
        const userDoc = await db.collection('users').doc(targetUid).get();
        const codeStatus = definition.getCodeStatus();
        let subject = '';
        let text = '';
        if (statusCd === codeStatus.approved.statusCd) {
          subject = '休暇申請が承認されました';
          text = '休暇申請が承認されました。';
        } else {
          subject = '休暇申請が却下されました';
          text = `${reason}という理由で休暇申請が却下されました。`;
        }
        const mailInfo = {
          destination: userDoc.get('email'),
          subject: subject,
          text: text
        };
        mail.sendMailToStaff(mailInfo);

      } catch (error) {
        throw error.message;
      }
    },

    // 経費申請
    async applyExpenses({ dispatch }, item) {
      try {
        const user = this.getters.getLoginUser;
        const docRef = await firebase.firestore().collection('expenses').add({});
        // firestrageへ登録
        const imagesRef = firebase.storage().ref().child(`images/${user.uid}/${docRef.id}.jpg`);
        const snapshot = await imagesRef.putString(item.image.substring(23), 'base64');
        const imageUrl = await snapshot.ref.getDownloadURL();
        // firestoreへ登録
        await firebase.firestore().collection('expenses').doc(docRef.id).set({
          uid: user.uid,
          expensesId: docRef.id,
          staffName: user.staffName,
          useDate: item.useDate,
          money: item.money,
          applyStatusCd: item.applyStatusCd,
          memo: item.memo,
          reason: '',
          imageUrl: imageUrl
        });
        await firebase.firestore().collection('expenses').doc(user.uid).collection('expensesId').doc(docRef.id).set({
          uid: user.uid,
          expensesId: docRef.id,
          useDate: item.useDate,
          money: item.money,
          applyStatusCd: item.applyStatusCd,
          memo: item.memo,
          reason: ''
        });
        await dispatch('getExpenses');
        const mailInfo = {
          destinations: this.getters.getMailingList,
          subject: '経費精算申請がありました',
          text: `${user.staffName}から経費精算申請が届きました。`
        };
        mail.sendMailToAdministrator(mailInfo);
      } catch (error) {
        throw error.message;
      }
    },

    // 経費申請取消
    async cancelExpenses({ dispatch }, param) {
      try {
        const uid = this.getters.getLoginUser.uid;
        const staffName = this.getters.getLoginUser.staffName;
        await firebase.storage().ref().child(`images/${uid}/${param.expensesId}.jpg`).delete();
        await firebase.firestore().collection('expenses').doc(uid).collection('expensesId').doc(param.expensesId).delete();
        await firebase.firestore().collection('expenses').doc(param.expensesId).delete();
        await dispatch('getExpenses');
        const mailInfo = {
          destinations: this.getters.getMailingList,
          subject: '経費精算申請取消が行われました',
          text: `${staffName}が経費精算申請を取消しました。`
        };
        mail.sendMailToAdministrator(mailInfo);
      } catch (error) {
        throw error.message;
      }
    },

    // 経費申請情報を取得(スタッフの場合)
    async getExpenses({ commit }) {
      try {
        const uid = this.getters.getLoginUser.uid;
        const expensesRef = await firebase.firestore().collection('expenses').doc(uid).collection('expensesId').get();
        const expenses = [];
        expensesRef.forEach(expensesDoc => {
          expenses.push({
            expensesId: expensesDoc.get('expensesId'),
            useDate: expensesDoc.get('useDate'),
            money: expensesDoc.get('money'),
            applyStatusCd: expensesDoc.get('applyStatusCd'),
            memo: expensesDoc.get('memo')
          });
        });
        commit('commitExpenses', expenses);
      } catch (error) {
        throw error.message;
      }
    },

    // 経費申請情報を取得(管理者の場合)
    async getExpensesList({ commit }) {
      try {
        const expensesRef = await firebase.firestore().collection('expenses').get();
        const expenses = [];
        expensesRef.forEach(expensesDoc => {
          expenses.push({
            uid: expensesDoc.get('uid'),
            expensesId: expensesDoc.get('expensesId'),
            staffName: expensesDoc.get('staffName'),
            useDate: expensesDoc.get('useDate'),
            money: expensesDoc.get('money'),
            applyStatusCd: expensesDoc.get('applyStatusCd'),
            memo: expensesDoc.get('memo'),
            imageUrl: expensesDoc.get('imageUrl')
          });
        });
        commit('commitExpenses', expenses);
      } catch (error) {
        throw error.message;
      }
    },

    // 経費申請承認,却下
    async changeExpensesStatusCd({ dispatch }, {targetUid, expensesId, statusCd, reason}) {
      try {
        const db = firebase.firestore();
        const batch = db.batch();
        const expRef = db.collection('expenses').doc(targetUid).collection('expensesId').doc(expensesId);
        const expListRef = db.collection('expenses').doc(expensesId);
        batch.update(expRef, {'applyStatusCd': statusCd});
        batch.update(expRef, {'reason': reason});
        batch.update(expListRef, {'applyStatusCd': statusCd});
        batch.update(expListRef, {'reason': reason});
        await batch.commit();
        await dispatch('getExpensesList');

        // 承認、却下結果をメール送信
        const userDoc = await db.collection('users').doc(targetUid).get();
        const codeStatus = definition.getCodeStatus();
        let subject = '';
        let text = '';
        if (statusCd === codeStatus.approved.statusCd) {
          subject = '経費精算申請が承認されました';
          text = '経費精算申請が承認されました';
        } else {
          subject = '経費精算申請が却下されました';
          text = `${reason}という理由で経費申請が却下されました。`;
        }
        const mailInfo = {
          destination: userDoc.get('email'),
          subject: subject,
          text: text
        };
        mail.sendMailToStaff(mailInfo);
      } catch (error) {
        throw error.message;
      }
    },

    // メーリングリストを取得（スタッフのみ）
    async getMailingList({ commit }) {
      try {
        const userRef = await firebase.firestore().collection('users').where('admin', '==', true).get();
        const mailingList = [];
        userRef.forEach(userDoc => {
          mailingList.push({
            destination: userDoc.get('email'),
          });
        });
        commit('commitMailingList', mailingList);
      } catch (error) {
        throw error.message;
      }
    },
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
    getStaffs: state => {
      return state.staffs;
    },
    getExpenses: state => {
      return state.expenses;
    },
    getImageUrl: state => {
      return state.imageUrl;
    },
    getMailingList: state => {
      return state.mailingList;
    }
  },
  plugins: [createPersistedState({storage: window.sessionStorage})]
})
