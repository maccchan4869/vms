<template>
  <div class="admin-vacation container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row common-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-right">
            <select v-model="selectedYear" class="mr-1">
              <option v-for="yearOption in yearOptions" :value="yearOption.value" v-bind:key="yearOption.value">{{ yearOption.dispValue }}</option>
            </select>
            <select v-model="selectedUid" class="mr-1">
              <option v-for="staffOption in staffOptions" :value="staffOption.uid" v-bind:key="staffOption.uid">{{ staffOption.staffName }}</option>
            </select>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="0" checked>申請中</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="1">承認済み</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="2">却下</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="3">取得済み</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="search" v-model="searchKey" value="4">全て</label>
            <input type="button" class="btn btn-primary" value="検索" @click="searchVacation">
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
              <td class="width-12 text-center">取得日（自）</td>
              <td class="width-12 text-center">取得日（至）</td>
              <td class="width-8 text-center">休暇種類</td>
              <td class="width-8 text-center">承認</td>
              <td class="width-8 text-center">詳細</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vacation in dispVacation" v-bind:key="vacation.vacationId">
              <td class="width-12 text-center">{{ vacation.staffName }}</td>
              <td class="width-12 text-center">{{ setDate(vacation.startDatetime) }}<br>{{ setTime(vacation.startDatetime) }}</td>
              <td class="width-12 text-center">{{ setDate(vacation.endDatetime) }}<br>{{ setTime(vacation.endDatetime) }}</td>
              <td class="width-8 text-center">{{ setTypeName(vacation.typeCd) }}</td>
              <td class="width-8 text-center"><input type="button" class="btn btn-primary" value="承認" 
                @click="changeVacationStatusCd(vacation, codeStatus.approved.statusCd)"
                v-if="vacation.applyStatusCd === codeStatus.applying.statusCd"></td>
              <td class="width-8 text-center"><input type="button" class="btn btn-danger" value="詳細"
                @click="openDetailModal(vacation)"
                v-if="vacation.applyStatusCd === codeStatus.applying.statusCd"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <transition-group  name="modal">
      <VacationDetailModal :val="targetVacation" @close="closeDetailModal" @approve="approveVacation" @reject="rejectVacation" v-if="isDispDetail"></VacationDetailModal>
    </transition-group >
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import VacationDetailModal from '@/components/VacationDetailModal.vue'
import definition from '@/helper/definition'

export default {
  name: 'Vacation',
  components: {
    Header,
    VacationDetailModal
  },
  created () {
    const staffs =  this.$store.getters.getStaffs;
    this.staffOptions = definition.getStaffOptions(staffs);
    this.codeStatus = definition.getCodeStatus();
    this.selectedYear = definition.getThisYear();
    this.yearOptions = definition.getYearOptions();
    this.searchVacation();
  },
  data () {
    return {
      vacation: [],
      dispVacation: [],
      targetVacation: null,
      codeStatus: null,
      searchKey: '0',
      vacationSearchKey: {
        applying: '0',
        approved: '1',
        rejected: '2',
        acquired: '3',
        all: '4'
      },
      selectedUid: null,
      staffOptions: [],
      selectedYear: 0,
      yearOptions: [],
      isDispDetail: false,
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
    openDetailModal(vacation) {
      this.targetVacation = vacation;
      this.isDispDetail = true;
    },
    closeDetailModal() {
      this.targetVacation = null;
      this.isDispDetail = false;
    },
    approveVacation() {
      this.changeVacationStatusCd(this.targetVacation, this.codeStatus.approved.statusCd);
    },
    rejectVacation(param) {
      this.changeVacationStatusCd(this.targetVacation, this.codeStatus.rejected.statusCd, param.reason);
    },
    // 検索
    async searchVacation() {
      await this.$store.dispatch('getVacationList', {
        year: this.selectedYear,
        targetUid: this.selectedUid
      });
      this.vacation = this.$store.getters.getVacation;
      this.dispVacation = this.vacation.filter(x => x.applyStatusCd === this.searchKey || this.searchKey === this.vacationSearchKey.all);
    },
    // 承認,却下
    async changeVacationStatusCd(vacation, statusCd, reason = '') {
      await this.$store.dispatch('changeVacationStatusCd', {
        targetUid: vacation.uid,
        vacationId: vacation.vacationId,
        statusCd: statusCd,
        reason: reason
      });
      this.searchVacation();
      this.closeDetailModal();
    }
  }
}
</script>
