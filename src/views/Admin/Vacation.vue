<template>
  <div class="admin-vacation container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row justify-content-center common-padding">
      <div class="resultArea">
        <table class="table-striped table-bordered">
          <thead>
            <tr>
              <td class="width-12 text-center">社員名</td>
              <td class="width-12 text-center">取得日（自）</td>
              <td class="width-12 text-center">取得日（至）</td>
              <td class="width-8 text-center">休暇種類</td>
              <td class="width-8 text-center">承認状態</td>
              <td class="width-8 text-center">承認</td>
              <td class="width-8 text-center">取消</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vacation in dispVacation" v-bind:key="vacation.vacationId">
              <td class="width-12 text-center">{{ vacation.staffName }}</td>
              <td class="width-12 text-center">{{ setDate(vacation.startDatetime) }}<br>{{ setTime(vacation.startDatetime) }}</td>
              <td class="width-12 text-center">{{ setDate(vacation.endDatetime) }}<br>{{ setTime(vacation.endDatetime) }}</td>
              <td class="width-8 text-center">{{ setTypeName(vacation.typeCd) }}</td>
              <td class="width-8 text-center">{{ setStatusName(vacation.applyStatusCd) }}</td>
              <td class="width-8 text-center"><input type="button" class="btn btn-primary" value="承認" v-if="vacation.applyStatusCd === codeStatus.applying.statusCd"></td>
              <td class="width-8 text-center"><input type="button" class="btn btn-danger" value="却下" v-if="vacation.applyStatusCd === codeStatus.applying.statusCd"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import definition from "@/helper/definition"

export default {
  name: 'Vacation',
  components: {
    Header
  },
  created() {
    this.vacation = this.$store.getters.getVacation;
    this.dispVacation = this.vacation;
    this.codeStatus = definition.getCodeStatus();
  },
  data () {
    return {
      vacation: [],
      dispVacation: [],
      codeStatus: null,
      errorMessage: ''
    }
  },
  methods: {
    setTypeName(typeCd) {
      return definition.setTypeName(typeCd);
    },
    setStatusName(statusCd) {
      return definition.setStatusName(statusCd);
    },
    setDate(datetime) {
      return definition.setDate(datetime);
    },
    setTime(datetime) {
      return definition.setTime(datetime);
    },
  }
}
</script>
