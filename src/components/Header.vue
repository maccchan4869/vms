<template>
  <div class="header">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid common-header">
        <img alt="company logo" class="img_logo" src="../assets/logo.jpg">
        <div class="navbar-right">
          <ul class="nav navbar-nav">
            <li class="nav-item mr-3" v-if="isAdmin">
              <router-link to="/admin/user">ユーザー一覧</router-link>
            </li>
            <li class="nav-item mr-3" v-if="isAdmin">
              <router-link to="/admin/vacation">休暇一覧</router-link>
            </li>
            <li class="nav-item mr-3" v-if="isAdmin">
              <router-link to="/admin/expenses">経費一覧</router-link>
            </li>
            <li class="nav-item mr-3" v-if="isStaff">
              <router-link to="/employee/vacation">休暇申請</router-link>
            </li>
            <li class="nav-item mr-3" v-if="isStaff">
              <router-link to="/employee/expenses">経費申請</router-link>
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
    }
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

.router-link-active {
  color: #34383b !important;
  vertical-align: middle;
  text-decoration: none;
}

a {
  color: white !important;
  vertical-align: middle;
  text-decoration: none;
}

</style>
