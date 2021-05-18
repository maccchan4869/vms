<template>
  <div class="Vacation container-fluid">
    <Header/>
    <div class="row common-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">残休暇日数：{{ daysLeft }}日</div>
          <div class="col-lg-8 text-right">
            <select v-model="selectedYear" @change="searchVacation">
              <option v-for="yearOption in yearOptions" :value="yearOption.value" v-bind:key="yearOption.value">{{ yearOption.dispValue }}</option>
            </select>
            <label class="mx-2"><input class="mr-1" type="radio" name="sort" v-model="sortKey" @change="sortVacation" value="1" checked>開始日時</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="sort" v-model="sortKey" @change="sortVacation" value="2">休暇種別</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="sort" v-model="sortKey" @change="sortVacation" value="3">承認ステータス</label>
            <input type="button" class="btn btn-primary" value="申請" @click="openVacationModal()">
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center common-padding">
      <div class="resultArea">
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
            <tr v-for="vacation in dispVacation" v-bind:key="vacation.serialNo">
              <td class="width-12 text-center">{{ setDate(vacation.startDatetime) }}<br>{{ setTime(vacation.startDatetime) }}</td>
              <td class="width-12 text-center">{{ setDate(vacation.endDatetime) }}<br>{{ setTime(vacation.endDatetime) }}</td>
              <td class="width-8 text-center">{{ setTypeName(vacation.typeCd) }}</td>
              <td class="width-8 text-center">{{ setStatusName(vacation.applyStatusCd) }}</td>
              <td class="width-20 text-center">{{ vacation.memo }}</td>
              <td class="width-8 text-center"><input type="button" class="btn btn-danger" value="取消" @click="openCancelModal(vacation)" v-if="vacation.applyStatusCd !== codeStatus.acquired.statusCd"></td>
            </tr>
          </tbody>
        </table>
      </div>
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
      dispVacation: [],
      cancelItem: null,
      isDispVacation: false,
      isDispCancel: false,
      codeStatus: null,
      sortKey: '1',
      vacationSortKey: {
        startDay: '1',
        typeCd: '2',
        applyStatusCd: '3'
      },
      selectedYear: 2021,
      yearOptions: [
        {value: 2018, dispValue: '2018年度'},
        {value: 2019, dispValue: '2019年度'},
        {value: 2020, dispValue: '2020年度'},
        {value: 2021, dispValue: '2021年度'},
      ]
    }
  },
  created() {
    this.vacation = this.$store.getters.getVacation;
    this.dispVacation = this.vacation;
    const userInfo = this.$store.getters.getLoginUser;
    this.daysLeft = userInfo.daysLeft;
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
    openCancelModal(item) {
      this.isDispCancel = true;
      this.cancelItem = item;
    },
    closeCancelModal() {
      this.isDispCancel = false;
      this.cancelItem = null;
    },
    // ソート機能
    sortVacation() {
      switch (this.sortKey) {
        case this.vacationSortKey.startDay:
          this.dispVacation.sort( (a, b) => {
            if(a.startDatetime > b.startDatetime) return -1;
            if(a.startDatetime < b.startDatetime) return 1;
          });
          break;
        case this.vacationSortKey.typeCd:
          this.dispVacation.sort( (a, b) => {
            if(a.typeCd > b.typeCd) return 1;
            if(a.typeCd < b.typeCd) return -1;
          });
          break;
        case this.vacationSortKey.applyStatusCd:
          this.dispVacation.sort( (a, b) => {
            if(a.applyStatusCd > b.applyStatusCd) return 1;
            if(a.applyStatusCd < b.applyStatusCd) return -1;
          });
          break;
      }
    },
    // 検索機能
    searchVacation() {
      const firstDay = new Date(this.selectedYear, 0, 1);
      const finalDay = new Date(this.selectedYear + 1, 3, 1);
      this.dispVacation = this.vacation.filter(value => 
        value.startDatetime.getTime() >= firstDay.getTime() && value.startDatetime.getTime() < finalDay.getTime());
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
    },
    // 休暇申請を取消
    async cancelVacation() {
      try {
        await this.$store.dispatch('cancelVacation', this.cancelItem);
        this.vacation = this.$store.getters.getVacation;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '取消に失敗しました';
        console.error(error);
      }
      this.closeCancelModal();
    }
  }
}
</script>
