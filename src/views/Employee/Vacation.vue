<template>
  <div class="Vacation container-fluid">
    <Header/>
    <div class="row align-items-center common-padding">
      <div class="col-4">残休暇日数：{{ daysLeft }}日</div>
      <div class="col-8 text-right">
        <input type="button" class="btn btn-primary" value="申請" @click="openVacationModal()">
      </div>
    </div>
    <div class="row justify-content-center common-padding">
      <table class="table-striped table-bordered">
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
            <td class="text-center"><input type="button" class="btn btn-danger" value="取消" @click="openCancelModal" v-if="vacation.applyStatusCd !== codeStatus.acquired"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <transition-group  name="modal">
      <VacationAppModal @close="closeVacationModal" @apply="applyVacation" v-if="isDispVacation"></VacationAppModal>
      <VacationCancelModal @close="closeCancelModal" @cancel="cancelVacation" v-if="isDispCancel"></VacationCancelModal>
    </transition-group >
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import VacationAppModal from '@/components/VacationAppModal.vue'
import VacationCancelModal from '@/components/VacationCancelModal.vue'
import definition from "@/helper/definition"

export default {
  name: 'vacation',
  components: {
    Header,
    VacationAppModal,
    VacationCancelModal
  },
  data () {
    return {
      daysLeft: 0,
      vacation: [],
      isDispVacation: false,
      isDispCancel: false,
      codeStatus: null
    }
  },
  created() {
    this.vacation = this.$store.getters.getVacation;
    const vacationInfo = this.$store.getters.getVacationInfo;
    this.daysLeft = vacationInfo.remainingVacationDays;
    this.codeStatus = definition.getCodeStatus();
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
    // 申請モーダル
    openVacationModal() {
      this.isDispVacation = true;
    },
    closeVacationModal() {
      this.isDispVacation = false;
    },
    // キャンセルモーダル
    openCancelModal() {
      this.isDispCancel = true;
    },
    closeCancelModal() {
      this.isDispCancel = false;
    },
    // 休暇を申請
    async applyVacation(item) {
      try {
        await this.$store.dispatch('applyVacation', item);
        this.vacation = this.$store.getters.getVacation;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '登録に失敗しました';
        console.error(error);
      }
      this.closeVacationModal();
    }
  }
}
</script>


