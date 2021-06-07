<template>
  <div class="User container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row common-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-right">
            <label class="mx-2">検索</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" @change="searchUser" value="1" checked>全て</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" @change="searchUser" value="2">管理者</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" @change="searchUser" value="3">スタッフ</label>
            <label class="mx-2">ソート</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="sort" v-model="sortKey" @change="sortUser" value="1" checked>スタッフ名</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="sort" v-model="sortKey" @change="sortUser" value="2">入社日</label>
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
            <tr v-for="staff in dispStaffs" v-bind:key="staff.uid">
              <td class="width-12 text-center">{{ staff.staffName }}</td>
              <td class="width-20 text-center">{{ staff.email }}</td>
              <td class="width-12 text-center">{{ setDate(staff.joiningDate) }}</td>
              <td class="width-8 text-center">{{ setDaysLeft(staff) }}</td>
              <td class="width-8 text-center"><input type="button" class="btn btn-primary" value="編集" @click="openEditModal(staff)"></td>
              <td class="width-8 text-center"><input type="button" class="btn btn-danger" value="削除" @click="openDeleteModal(staff)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    <transition-group  name="modal">
      <RegisterUserModal @close="closeRegisterModal" @register="registerAccount" v-if="isDispRegister"></RegisterUserModal>
      <DeleteUserModal @close="closeDeleteModal" @delete="deleteAccount" v-if="isDispDelete"></DeleteUserModal>
      <EditUserModal :val="targetStaff" @close="closeEditModal" @edit="editAccount" v-if="isDispEdit"></EditUserModal>
    </transition-group >
    </div>
  </div>
  
</template>

<script>
import Header from '@/components/Header.vue'
import RegisterUserModal from '@/components/RegisterUserModal.vue'
import DeleteUserModal from '@/components/DeleteUserModal.vue'
import EditUserModal from '@/components/EditUserModal.vue'
import definition from '@/helper/definition'

export default {
  name: 'user',
  components: {
    Header,
    RegisterUserModal,
    DeleteUserModal,
    EditUserModal
  },
  created() {
    this.staffs = this.$store.getters.getStaffs;
    this.searchUser();
  },
  data () {
    return {
      staffs: [],
      dispStaffs: [],
      targetStaff: null,
      searchKey: '1',
      useSearchKey: {
        all: '1',
        admin: '2',
        staff: '3'
      },
      sortKey: '1',
      userSortKey: {
        staffName: '1',
        joiningDate: '2'
      },
      errorMessage: '',
      isDispRegister: false,
      isDispDelete: false,
      isDispEdit: false
    }
  },
  methods: {
    openRegisterModal() {
      this.isDispRegister = true;
    },
    closeRegisterModal() {
      this.isDispRegister = false;
    },
    openDeleteModal(staff) {
      this.targetStaff = staff;
      this.isDispDelete = true;
    },
    closeDeleteModal() {
      this.targetStaff = null;
      this.isDispDelete = false;
    },
    openEditModal(staff) {
      this.targetStaff = staff;
      this.isDispEdit = true;
    },
    closeEditModal() {
      this.targetStaff = null;
      this.isDispEdit = false;
    },
    setDate(datetime) {
      return definition.setDate(datetime);
    },
    setDaysLeft(staff) {
      if (staff.admin) return '－';
      else return `${staff.daysLeft}日`;
    },
    searchUser() {
      switch (this.searchKey) {
        case this.useSearchKey.all:
          this.dispStaffs = this.staffs;
          break;
        case this.useSearchKey.admin:
          this.dispStaffs = this.staffs.filter(x => x.admin);
          break;
        case this.useSearchKey.staff:
          this.dispStaffs = this.staffs.filter(x => !x.admin);
          break;
      }
      this.sortUser();
    },
    // ソート機能
    sortUser() {
      switch (this.sortKey) {
        case this.userSortKey.staffName:
          this.dispStaffs.sort( (a, b) => {
            if(a.staffName > b.staffName) return 1;
            if(a.staffName < b.staffName) return -1;
          });
          break;
        case this.userSortKey.joiningDate:
          this.dispStaffs.sort( (a, b) => {
            if(a.joiningDate > b.joiningDate) return 1;
            if(a.joiningDate < b.joiningDate) return -1;
          });
          break;
      }
    },
    // アカウントを作成
    async registerAccount(item) {
      try {
        await this.$store.dispatch('registerAccount', item);
        this.staffs = this.$store.getters.getStaffs;
        this.searchUser();
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '登録に失敗しました';
        console.error(error);
      }
      this.closeRegisterModal();
    },
    // アカウントを削除
    async deleteAccount() {
      try {
        await this.$store.dispatch('deleteAccount', (this.targetStaff.uid));
        this.staffs = this.$store.getters.getStaffs;
        this.searchUser();
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '削除に失敗しました';
        console.error(error);
      }
      this.closeDeleteModal();
    },
    // アカウントを編集
    async editAccount(changedVal) {
      try {
        const changedDaysLeft = changedVal - this.targetStaff.daysLeft;
        await this.$store.dispatch('editAccount', {
          targetUid: this.targetStaff.uid,
          changedDaysLeft: changedDaysLeft
        });
        this.staffs = this.$store.getters.getStaffs;
        this.searchUser();
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '更新に失敗しました';
        console.error(error);
      }
      this.closeEditModal();
    }
  }
}
</script>
