<template>
  <div class="User">
    <Header/>
    <div><label class="errorMessage">{{ errorMessage }}</label></div>
    <input type="button" value="新規追加" @click="openRegisterModal()">
    <transition-group  name="modal">
      <RegisterUserModal @close="closeRegisterModal" @register="registerAccount" v-if="isDispRegister"></RegisterUserModal>
    </transition-group >
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import RegisterUserModal from '@/components/RegisterUserModal.vue'

export default {
  name: 'user',
  components: {
    Header,
    RegisterUserModal
  },
  data () {
    return {
      errorMessage: '',
      isDispRegister: false
    }
  },
  methods: {
    openRegisterModal() {
      this.isDispRegister = true;
    },
    closeRegisterModal() {
      this.isDispRegister = false;
    },
    // アカウントを作成
    async registerAccount(item) {
      try {
        await this.$store.dispatch('registerAccount', item);
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '登録に失敗しました';
        console.error(error);
      }
      this.closeRegisterModal();
    }
  }
}
</script>
