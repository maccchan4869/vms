<template>
  <div class="Vacation container-fluid">
    <Header/>
    <div class="searchArea">
      <label>残休暇日数：{{ daysLeft }}</label>
      <input type="button" class="btn btn-primary" value="申請">
    </div>
    <div class="resultArea row justify-content-center">
      <table>
        <thead>
          <tr>
            <th>取得日（自）</th>
            <th>取得日（至）</th>
            <th>休暇種類</th>
            <th>進捗状態</th>
            <th>事由</th>
            <th>取消</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vacation in vacation" v-bind:key="vacation.serialNo">
            <th>{{ setDate(vacation.startDatetime) }}<br>{{ setTime(vacation.startDatetime) }}</th>
            <th>{{ setDate(vacation.endDatetime) }}<br>{{ setTime(vacation.endDatetime) }}</th>
            <th>{{ setTypeName(vacation.typeCd) }}</th>
            <th>{{ setStatusName(vacation.applyStatusCd) }}</th>
            <th>{{ vacation.memo }}</th>
            <th><input type="button" class="btn btn-danger" value="取消"></th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import definition from "@/helper/definition"

export default {
  name: 'vacation',
  components: {
    Header
  },
  data () {
    return {
      daysLeft: 0,
      vacation: []
    }
  },
  created() {
    this.vacation = this.$store.getters.getVacation;
    const vacationInfo = this.$store.getters.getVacationInfo;
    this.daysLeft = vacationInfo.remainingVacationDays;
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
    }
  }
}
</script>
