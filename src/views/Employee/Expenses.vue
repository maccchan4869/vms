<template>
  <div class="expenses container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row common-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-right">
            <select class="mr-3" v-model="selectedYear" @change="searchExpenses">
              <option v-for="yearOption in yearOptions" :value="yearOption.value" v-bind:key="yearOption.value">{{ yearOption.dispValue }}</option>
            </select>
            <input type="button" class="btn btn-primary" value="申請" @click="openExpensesModal()">
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center common-padding">
      <div class="resultArea">
        <table class="table-striped table-bordered">
          <thead>
            <tr>
              <td class="width-12 text-center">使用日</td>
              <td class="width-12 text-center">金額</td>
              <td class="width-20 text-center">事由</td>
              <td class="width-8 text-center">承認状態</td>
              <td class="width-8 text-center">取消</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expenses in dispExpenses" v-bind:key="expenses.expensesId">
              <td class="width-12 text-center">{{ setDate(expenses.useDate) }}</td>
              <td class="width-12 text-center">{{ setComma(expenses.money) }}円</td>
              <td class="width-20 text-center">{{ expenses.memo }}</td>
              <td class="width-8 text-center">{{ setStatusName(expenses.applyStatusCd) }}</td>
              <td class="width-8 text-center"><input type="button" class="btn btn-danger" value="取消"
                @click="openCancelModal(expenses)" v-if="expenses.applyStatusCd !== codeStatus.approved.statusCd"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination ref="pagination" :maxPageIndex="maxPageIndex" @setPage="setPage"></Pagination>
    <transition-group  name="modal">
      <AppExpensesModal @close="closeExpensesModal" @apply="applyExpenses" v-if="isDispExpenses"></AppExpensesModal>
      <CancelModal @close="closeCancelModal" @cancel="cancelExpenses" v-if="isDispCancel"></CancelModal>
    </transition-group >
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import AppExpensesModal from '@/components/AppExpensesModal.vue'
import CancelModal from '@/components/CancelModal.vue'
import Pagination from '@/components/Pagination.vue'
import definition from '@/helper/definition'

export default {
  name: 'Expenses',
  components: {
    Header,
    AppExpensesModal,
    CancelModal,
    Pagination
  },
  data () {
    return {
      expenses: [],
      dispExpenses: [],
      cancelItem: null,
      codeStatus: null,
      selectedYear: 0,
      yearOptions: [],
      isDispExpenses: false,
      isDispCancel: false,
      nowPageIndex: 1,
      maxPageIndex: 1,
      errorMessage: ''
    }
  },
  created() {
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
    // 経費申請モーダル
    openExpensesModal() {
      this.isDispExpenses = true;
    },
    closeExpensesModal() {
      this.isDispExpenses = false;
    },
    // キャンセルモーダル
    openCancelModal(item) {
      this.isDispCancel = true;
      this.cancelItem = item;
    },
    closeCancelModal() {
      this.isDispCancel = false;
      this.cancelItem = null;
    },
    // 検索機能
    searchExpenses() {
      this.resetPageIndex();
      const firstDay = new Date(this.selectedYear, 3, 1);
      const finalDay = new Date(this.selectedYear + 1, 3, 1);
      const expenses = this.$store.getters.getExpenses;
      this.expenses = expenses.filter(value => 
        new Date(value.useDate).getTime() >= firstDay.getTime() && new Date(value.useDate).getTime() < finalDay.getTime());
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
    // 経費申請
    async applyExpenses(param) {
      try {
        await this.$store.dispatch('applyExpenses', param);
        this.searchExpenses();
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '登録に失敗しました';
        console.error(error);
      }
      this.closeExpensesModal();
    },
    // 経費申請を取消
    async cancelExpenses() {
      try {
        await this.$store.dispatch('cancelExpenses', this.cancelItem);
        this.searchExpenses();
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '登録に失敗しました';
        console.error(error);
      }
      this.closeCancelModal();
    }
  }
}
</script>
