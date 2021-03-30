<template>
  <div class="login">
    <Header/>
    <div><label class="errorMessage">{{ errorMessage }}</label></div>
    <div>
      <div>メールアドレス</div>
      <div><input type="text" placeholder="E-mail" v-model="email"></div>
    </div>
    <div>
      <div>パスワード</div>
      <div><input type="password" placeholder="Password" v-model="password"></div>
    </div>
    <input type="button" class="btn btn-outline-primary" value="ログイン" @click="clickLogin">
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'login',
  components: {
    Header
  },
  data () {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    // ログイン
    async clickLogin() {
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        });
        const loginUser = this.$store.getters.getLoginUser;
        if(loginUser.admin) {
          this.$router.push('/admin/user');
        } else {
          this.$router.push('/employee/vacation');
        }
      } catch (error) {
        this.errorMessage = 'ログインに失敗しました';
        console.error(error);
      }
    }
  }
}
</script>
