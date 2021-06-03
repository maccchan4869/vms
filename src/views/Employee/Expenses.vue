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
                @click="openCancelModal(expenses)" v-if="expenses.applyStatusCd !== codeStatus.acquired.statusCd"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
import definition from "@/helper/definition"

export default {
  name: 'Expenses',
  components: {
    Header,
    AppExpensesModal,
    CancelModal
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
      errorMessage: ''
    }
  },
  created() {
    this.expenses = this.$store.getters.getExpenses;
    this.dispExpenses = this.expenses;
    this.codeStatus = definition.getCodeStatus();
    this.selectedYear = definition.getThisYear();
    this.yearOptions = definition.getYearOptions();
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
      const firstDay = new Date(this.selectedYear, 0, 1);
      const finalDay = new Date(this.selectedYear + 1, 3, 1);
      this.dispExpenses = this.expenses.filter(value => 
        new Date(value.useDate).getTime() >= firstDay.getTime() && new Date(value.useDate).getTime() < finalDay.getTime());
    },
    // 経費申請
    async applyExpenses(param) {
      try {
        await this.$store.dispatch('applyExpenses', param);
        this.expenses = this.$store.getters.getExpenses;
        this.dispExpenses = this.expenses;
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
        this.expenses = this.$store.getters.getExpenses;
        this.dispExpenses = this.expenses;
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
