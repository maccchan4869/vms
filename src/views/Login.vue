<template>
  <div class="login container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row align-items-center justify-content-center common-padding">
      <div class="cellTitle">メールアドレス</div>
      <div><input type="text" placeholder="E-mail" v-model="email"></div>
    </div>
    <div class="row align-items-center justify-content-center common-padding">
      <div class="cellTitle">パスワード</div>
      <div><input type="password" placeholder="Password" v-model="password"></div>
    </div>
    <div class="row align-items-center justify-content-center common-padding">
      <input type="button" class="btn btn-primary" value="ログイン" @click="clickLogin">
    </div>
    <div class="row align-items-center justify-content-center common-padding mt-5">
      <p><router-link to="/password">パスワードの再設定はこちら</router-link></p>
    </div>
    <div class="row align-items-center justify-content-center common-padding mt-5">
      <input type="button" class="btn btn-primary btn-temporary mr-2" value="管理者として仮ログイン" @click="clickAdminLogin">
      <input type="button" class="btn btn-primary btn-temporary ml-2" value="スタッフとして仮ログイン" @click="clickStaffLogin">
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import definition from '@/helper/definition'

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
      const year = definition.getThisYear();
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        });
        const loginUser = this.$store.getters.getLoginUser;
        if (loginUser.admin) {
          await this.$store.dispatch('getVacationList', {
            year: year,
            targetUid: null
          });
          await this.$store.dispatch('getExpensesList');
          this.$router.push('/admin/user');
        } else {
          await this.$store.dispatch('getVacation');
          await this.$store.dispatch('getVacationInfo');
          await this.$store.dispatch('getExpenses');
          await this.$store.dispatch('getMailingList');
          this.$router.push('/employee/vacation');
        }
      } catch (error) {
        this.errorMessage = 'ログインに失敗しました';
        console.error(error);
      }
    },
    // 管理者として仮ログイン
    clickAdminLogin() {
      this.email = 'a@test.com';
      this.password = '123456';
      this.clickLogin();
    },
    // スタッフとして仮ログイン
    clickStaffLogin() {
      this.email = 'b@test.com';
      this.password = '123456';
      this.clickLogin();
    }
  }
}
</script>

<style>
.btn-temporary {
  width: 250px !important;
}
</style>
