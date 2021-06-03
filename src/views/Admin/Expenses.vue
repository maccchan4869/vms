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
            <select class="mr-3" v-model="selectedYear" @change="searchExpenses">
              <option v-for="yearOption in yearOptions" :value="yearOption.value" v-bind:key="yearOption.value">{{ yearOption.dispValue }}</option>
            </select>
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
                v-if="expenses.applyStatusCd !== codeStatus.acquired.statusCd"></td>
              <td class="width-8 text-center"><input type="button" class="btn btn-danger" value="詳細"
                v-if="expenses.applyStatusCd !== codeStatus.acquired.statusCd"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <transition-group  name="modal">
    </transition-group >
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import definition from "@/helper/definition"

export default {
  name: 'Expenses',
  components: {
    Header
  },
  data () {
    return {
      expenses: [],
      dispExpenses: [],
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
    }
  }
}
</script>
