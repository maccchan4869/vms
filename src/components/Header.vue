<template>
  <div class="header">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <img alt="company logo" class="img_logo" src="../assets/logo.jpg">
        <div class="navbar-right">
          <ul class="nav navbar-nav">
            <li class="nav-item">
              <div v-if="isLogin">
                <input type="button" class="btn btn-danger" value="ログアウト" @click="clickLogout">
              </div>
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
      isLogin: false
    }
  },
  created() {
    const loginUser = this.$store.getters.getLoginUser;
    this.isLogin = loginUser.uid !== '';
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