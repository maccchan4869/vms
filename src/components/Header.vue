<template>
  <div class="header">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid common-header">
        <img alt="company logo" class="img_logo" src="../assets/logo.jpg">
        <div class="navbar-right">
          <ul class="nav nav-pills navi-list">
            <li class="nav-item mr-3" v-if="isAdmin">
              <router-link to="/admin/user" class="page-link">ユーザー一覧</router-link>
            </li>
            <li class="nav-item mr-3" v-if="isAdmin">
              <router-link to="/admin/vacation" class="page-link">休暇一覧</router-link>
            </li>
            <li class="nav-item mr-3" v-if="isAdmin">
              <router-link to="/admin/expenses" class="page-link">経費一覧</router-link>
            </li>
            <li class="nav-item mr-3" v-if="isStaff">
              <router-link to="/employee/vacation" class="page-link">休暇申請</router-link>
            </li>
            <li class="nav-item mr-3" v-if="isStaff">
              <router-link to="/employee/expenses" class="page-link">経費申請</router-link>
            </li>
            <li class="nav-item" v-if="isLogin">
              <a class="page-link" href="#" @click.prevent.stop="clickLogout">ログアウト</a>
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
    console.log(this.nowNavi);
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
  background-color: black;
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

.navi-list a {
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
}

.navi-list a.router-link-exact-active {
  color: black;
  background-color: white;
  border: none;
  border-radius: 4px;
}

</style>