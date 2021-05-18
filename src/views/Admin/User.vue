<template>
  <div class="User container-fluid">
    <Header/>
    <div><label class="errorMessage">{{ errorMessage }}</label></div>
    <div class="row common-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-right">
            <input type="button" class="btn btn-primary" value="新規追加" @click="openRegisterModal()">
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center common-padding">
      <div class="resultArea">
        <table class="table-striped table-bordered">
          <thead>
            <tr>
              <td class="width-12 text-center">社員名</td>
              <td class="width-20 text-center">メールアドレス</td>
              <td class="width-12 text-center">入社日</td>
              <td class="width-8 text-center">残休暇日数</td>
              <td class="width-8 text-center">編集</td>
              <td class="width-8 text-center">削除</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="staff in staffs" v-bind:key="staff.uid">
              <td class="width-12 text-center">{{ staff.staffName }}</td>
              <td class="width-20 text-center">{{ staff.email }}</td>
              <td class="width-12 text-center">{{ setDate(staff.joiningDate) }}</td>
              <td class="width-8 text-center">{{ setDaysLeft(staff) }}</td>
              <td class="width-8 text-center"><input type="button" class="btn btn-primary" value="編集"></td>
              <td class="width-8 text-center"><input type="button" class="btn btn-danger" value="削除"></td>
            </tr>
          </tbody>
        </table>
      </div>
    <transition-group  name="modal">
      <RegisterUserModal @close="closeRegisterModal" @register="registerAccount" v-if="isDispRegister"></RegisterUserModal>
    </transition-group >
    </div>
  </div>

  
</template>

<script>
import Header from '@/components/Header.vue'
import RegisterUserModal from '@/components/RegisterUserModal.vue'
import definition from "@/helper/definition"

export default {
  name: 'user',
  components: {
    Header,
    RegisterUserModal
  },
  created() {
    this.staffs = this.$store.getters.getStaffs;
  },
  data () {
    return {
      staffs: [],
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
    setDate(datetime) {
      return definition.setDate(datetime);
    },
    setDaysLeft(staff) {
      if (staff.admin) return '－';
      else return `${staff.daysLeft}日`;
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
