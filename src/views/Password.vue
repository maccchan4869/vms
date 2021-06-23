<template>
  <div class="login container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row align-items-center justify-content-center common-padding">
      <p>下記にメールアドレスを入力し、メール送信ボタンを押してください</p>
    </div>
    <div class="row align-items-center justify-content-center common-padding">
      <div class="cellTitle">メールアドレス</div>
      <div><input type="text" placeholder="E-mail" v-model="email"></div>
    </div>
    <div class="row align-items-center justify-content-center common-padding">
      <input type="button" class="btn btn-primary" value="メール送信" @click="sendPasswordResetMail">
    </div>
    <div class="row align-items-center justify-content-center common-padding mt-5">
      <p><router-link to="/">ログイン画面へ戻る</router-link></p>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import firebase from 'firebase'

export default {
  name: 'login',
  components: {
    Header
  },
  data () {
    return {
      email: '',
      errorMessage: ''
    }
  },
  methods: {
    // パスワードリセットメールを送信
    async sendPasswordResetMail() {
      try {
        const auth = firebase.auth();
        await auth.sendPasswordResetEmail(this.email);
        alert('メール送信に成功しました。ページを閉じてご確認ください。');
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'メール送信に失敗しました。';
        console.error(error);
      }
    }
  }
}
</script>
