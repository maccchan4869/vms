<template>
  <div class="admin-expenses container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row common-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-right">
            <select class="mr-1" v-model="selectedYear">
              <option v-for="yearOption in yearOptions" :value="yearOption.value" v-bind:key="yearOption.value">{{ yearOption.dispValue }}</option>
            </select>
            <select class="mr-1" v-model="selectedUid">
              <option v-for="staffOption in staffOptions" :value="staffOption.uid" v-bind:key="staffOption.uid">{{ staffOption.staffName }}</option>
            </select>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="0" checked>申請中</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="1">承認済み</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="2">却下</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="4">全て</label>
            <input type="button" class="btn btn-primary" value="検索" @click="searchExpenses">
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
              <td class="width-12 text-center">使用日</td>
              <td class="width-8 text-center">金額</td>
              <td class="width-20 text-center">事由</td>
              <td class="width-8 text-center">承認</td>
              <td class="width-8 text-center">詳細</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expenses in dispExpenses" v-bind:key="expenses.expensesId">
              <td class="width-12 text-center">{{ expenses.staffName }}</td>
              <td class="width-12 text-center">{{ setDate(expenses.useDate) }}</td>
              <td class="width-8 text-center">{{ setComma(expenses.money) }}円</td>
              <td class="width-20 text-center">{{ expenses.memo }}</td>
              <td class="width-8 text-center"><input type="button" class="btn btn-primary" value="承認"
               @click="changeExpensesStatusCd(expenses, codeStatus.approved.statusCd)"
               v-if="expenses.applyStatusCd === codeStatus.applying.statusCd"></td>
              <td class="width-8 text-center"><input type="button" class="btn btn-danger" value="詳細"
               @click="openDetailModal(expenses)"
                v-if="expenses.applyStatusCd !== codeStatus.acquired.statusCd"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination ref="pagination" :maxPageIndex="maxPageIndex" @setPage="setPage"></Pagination>
    <transition-group  name="modal">
      <ExpensesDetailModal :val="targetExpenses" @close="closeDetailModal" @approve="approveExpenses" @reject="rejectExpenses" v-if="isDispDetail"></ExpensesDetailModal>
    </transition-group >
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import ExpensesDetailModal from '@/components/ExpensesDetailModal.vue'
import Pagination from '@/components/Pagination.vue'
import definition from '@/helper/definition'

export default {
  name: 'Expenses',
  components: {
    Header,
    ExpensesDetailModal,
    Pagination
  },
  data () {
    return {
      expenses: [],
      dispExpenses: [],
      targetExpenses: null,
      codeStatus: null,
      selectedYear: 0,
      yearOptions: [],
      selectedUid: null,
      staffOptions: [],
      isDispDetail: false,
      searchKey: '0',
      expensesSearchKey: {
        applying: '0',
        approved: '1',
        rejected: '2',
        acquired: '3',
        all: '4'
      },
      nowPageIndex: 1,
      maxPageIndex: 1,
      errorMessage: ''
    }
  },
  created () {
    const staffs =  this.$store.getters.getStaffs;
    this.staffOptions = definition.getStaffOptions(staffs);
    this.codeStatus = definition.getCodeStatus();
    this.selectedYear = definition.getThisYear();
    this.yearOptions = definition.getYearOptions();
    this.searchExpenses();
  },
  methods: {
    setStatusName(statusCd) {
      return definition.setStatusName(statusCd);
    },
    setDate(date) {
      const datetime = new Date(date);
      return definition.setDate(datetime);
    },
    setComma(money) {
      return money.toLocaleString();
    },
    openDetailModal(expenses) {
      this.$store.commit('commitImageUrl', expenses.imageUrl);
      this.targetExpenses = expenses;
      this.isDispDetail = true;
    },
    closeDetailModal() {
      this.targetExpenses = null;
      this.isDispDetail = false;
    },
    approveExpenses() {
      this.changeExpensesStatusCd(this.targetExpenses, this.codeStatus.approved.statusCd);
    },
    rejectExpenses(param) {
      this.changeExpensesStatusCd(this.targetExpenses, this.codeStatus.rejected.statusCd, param.reason);
    },
    // 検索
    searchExpenses() {
      this.resetPageIndex();
      const firstDay = new Date(this.selectedYear, 3, 1);
      const finalDay = new Date(this.selectedYear + 1, 3, 1);
      this.expenses = this.$store.getters.getExpenses;
      this.expenses = this.expenses.filter(value => 
        new Date(value.useDate).getTime() >= firstDay.getTime() && new Date(value.useDate).getTime() < finalDay.getTime());
      this.expenses = this.expenses.filter(x => x.applyStatusCd === this.searchKey || this.searchKey === this.expensesSearchKey.all);
      if (this.selectedUid) {
        this.expenses = this.expenses.filter(x => x.uid === this.selectedUid);
      }
      this.maxPageIndex = definition.getMaxPageIndex(this.expenses.length);
      this.pagingExpenses();

    },
    // ページネーション
    pagingExpenses() {
      this.dispExpenses = definition.pagingItems(this.expenses, this.nowPageIndex);
    },
    setPage(index) {
      this.nowPageIndex = index;
      this.pagingExpenses();
    },
    resetPageIndex() {
      this.nowPageIndex = 1;
      // 初期表示時は、resetPageIndexをスキップする
      if (typeof this.$refs.pagination !== 'undefined') {
        this.$refs.pagination.resetPageIndex();
      }
    },
    // 承認,却下
    async changeExpensesStatusCd(expenses, statusCd, reason = '') {
      await this.$store.dispatch('changeExpensesStatusCd', {
        targetUid: expenses.uid,
        expensesId: expenses.expensesId,
        statusCd: statusCd,
        reason: reason
      });
      this.searchExpenses();
      this.closeDetailModal();
    }
  }
}
</script>
