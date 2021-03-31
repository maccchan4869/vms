<template>
  <div class="header">
    <div class="div_logo div_header">
      <img alt="company logo" class="img_logo" src="../assets/logo.jpg">
    </div>
    <div class="div_header" v-if="isLogin">
      <input type="button" class="btn btn-danger" value="ログアウト" @click="clickLogout">
    </div>
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

.div_header {
  display: inline-block;
}

.div_logo {
  margin-left: 2rem;
  width: 30%;
  height: 100%;
}

.div_logo .img_logo {
  height: 100%;
}
</style>