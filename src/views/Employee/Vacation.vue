<template>
  <div class="Vacation container-fluid">
    <Header/>
    <div class="row">
      <div class="col-4">
        <label>残休暇日数：{{ daysLeft }}</label>
      </div>
      <div class="col-8 text-right">
        <input type="button" class="btn btn-primary" value="申請">
      </div>
    </div>
    <div class="row justify-content-center">
      <table class="table-hover table-striped table-bordered">
        <thead>
          <tr>
            <td class="width-12 text-center">取得日（自）</td>
            <td class="width-12 text-center">取得日（至）</td>
            <td class="width-8 text-center">休暇種類</td>
            <td class="width-8 text-center">承認状態</td>
            <td class="width-20 text-center">メモ</td>
            <td class="width-8 text-center">取消</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vacation in vacation" v-bind:key="vacation.serialNo">
            <td class="text-center">{{ setDate(vacation.startDatetime) }}<br>{{ setTime(vacation.startDatetime) }}</td>
            <td class="text-center">{{ setDate(vacation.endDatetime) }}<br>{{ setTime(vacation.endDatetime) }}</td>
            <td class="text-center">{{ setTypeName(vacation.typeCd) }}</td>
            <td class="text-center">{{ setStatusName(vacation.applyStatusCd) }}</td>
            <td class="text-center">{{ vacation.memo }}</td>
            <td class="text-center"><input type="button" class="btn btn-danger" value="取消"></td>
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

<style scoped>
.width-20 {
 width: 20rem;
}

.width-12 {
 width: 12rem;
}

.width-8 {
 width: 8rem;
}
</style>

