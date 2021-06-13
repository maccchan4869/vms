<template>
  <div class="header">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <img alt="company logo" class="img_logo" src="../assets/logo.jpg">
        <div class="navbar-right">
          <ul class="nav navbar-nav">
            <li class="nav-item mr-3" v-if="isAdmin">
              <input type="button" class="btn btn-light" value="ユーザー一覧" @click="linkUserList">
            </li>
            <li class="nav-item mr-3" v-if="isAdmin">
              <input type="button" class="btn btn-light" value="休暇一覧" @click="linkAdminVacation">
            </li>
            <li class="nav-item mr-3" v-if="isAdmin">
              <input type="button" class="btn btn-light" value="経費一覧" @click="linkAdminExpenses">
            </li>
            <li class="nav-item mr-3" v-if="isStaff">
              <input type="button" class="btn btn-light" value="休暇申請" @click="linkVacation">
            </li>
            <li class="nav-item mr-3" v-if="isStaff">
              <input type="button" class="btn btn-light" value="経費申請" @click="linkExpenses">
            </li>
            <li class="nav-item" v-if="isLogin">
              <input type="button" class="btn btn-secondary" value="ログアウト" @click="clickLogout">
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Header',
  data () {
    return {
      isLogin: false,
      isAdmin: false,
      isStaff: false
    }
  },
  created() {
    const loginUser = this.$store.getters.getLoginUser;
    this.isLogin = loginUser.uid !== '';
    this.isAdmin = loginUser.admin && this.isLogin;
    this.isStaff = !loginUser.admin && this.isLogin;
  },
  methods: {
    // ログアウト
    async clickLogout() {
      try {
        await firebase.auth().signOut();
        this.$store.commit('commitLoginUser', {uid: '', staffName: '', admin: false});
        console.log('ログアウトしました');
        this.$router.push('/');
      } catch (error) {
        console.error(error.message);
      }
    },
    // ユーザー一覧へ遷移
    linkUserList() {
      this.$router.push('/admin/user');
    },
    // 休暇管理へ遷移
    linkAdminVacation() {
      this.$router.push('/admin/vacation');
    },
    // 経費管理へ遷移
    linkAdminExpenses() {
      this.$router.push('/admin/expenses');
    },
    // 休暇申請へ遷移
    linkVacation() {
      this.$router.push('/employee/vacation');
    },
    // 経費申請へ遷移
    linkExpenses() {
      this.$router.push('/employee/expenses');
    },
  }
}
</script>

<style scoped>
.header {
  background-color: #AAAFB1;
  width: 100%;
  height: 70px;
}

.navbar {
  height: 100%;
}

.container {
  height: 100%;
}

.img_logo {
  height: 100%;
}
</style>