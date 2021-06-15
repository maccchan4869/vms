<template>
  <div class="Vacation container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row common-padding">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">残休暇日数：{{ daysLeft }}日</div>
          <div class="col-lg-8 text-right">
            <select v-model="selectedYear" @change="searchVacation">
              <option v-for="yearOption in yearOptions" :value="yearOption.value" v-bind:key="yearOption.value">{{ yearOption.dispValue }}</option>
            </select>
            <label class="mx-2"><input class="mr-1" type="radio" name="sort" v-model="sortKey" @change="sortVacation" value="0" checked>開始日時</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="sort" v-model="sortKey" @change="sortVacation" value="1">休暇種別</label>
            <label class="mx-2"><input class="mr-1" type="radio" name="sort" v-model="sortKey" @change="sortVacation" value="2">承認ステータス</label>
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
            <tr v-for="vacation in dispVacation" v-bind:key="vacation.vacationId">
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
    <div class="row justify-content-center common-padding">
      <div class="container">
        <Pagination :maxPageIndex="maxPageIndex" @back="backPage" @next="nextPage" @setPage="setPage"></Pagination>
      </div>
    </div>
    <transition-group  name="modal">
      <AppVacationModal @close="closeVacationModal" @apply="applyVacation" v-if="isDispVacation"></AppVacationModal>
      <CancelModal @close="closeCancelModal" @cancel="cancelVacation" v-if="isDispCancel"></CancelModal>
    </transition-group >
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import AppVacationModal from '@/components/AppVacationModal.vue'
import CancelModal from '@/components/CancelModal.vue'
import Pagination from '@/components/Pagination.vue'
import definition from '@/helper/definition'

export default {
  name: 'vacation',
  components: {
    Header,
    AppVacationModal,
    CancelModal,
    Pagination
  },
  data () {
    return {
      uid: '',
      daysLeft: 0,
      vacation: [],
      dispVacation: [],
      cancelItem: null,
      isDispVacation: false,
      isDispCancel: false,
      codeStatus: null,
      sortKey: '0',
      vacationSortKey: {
        startDay: '0',
        typeCd: '1',
        applyStatusCd: '2'
      },
      selectedYear: 0,
      yearOptions: [],
      nowPageIndex: 1,
      maxPageIndex: 1,
      errorMessage: '' 
    }
  },
  created() {
    this.uid = this.$store.getters.getLoginUser.uid;
    this.daysLeft = this.$store.getters.getLoginUser.daysLeft;
    this.codeStatus = definition.getCodeStatus();
    this.selectedYear = definition.getThisYear();
    this.yearOptions = definition.getYearOptions();
    this.searchVacation();
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
      const firstDay = new Date(this.selectedYear, 3, 1);
      const finalDay = new Date(this.selectedYear + 1, 3, 1);
      const vacationList = this.$store.getters.getVacation;
      this.vacation = vacationList.filter(value => 
        value.startDatetime.getTime() >= firstDay.getTime() && value.startDatetime.getTime() < finalDay.getTime());
      this.setMaxPageIndex();
      this.pagingVacation();
    },
    // 最大ページ数を設定
    setMaxPageIndex() {
      const isAddNextPage = this.vacation.length % 10 !== 0;
      const maxIndex = Math.floor(this.vacation.length / 10);
      this.maxPageIndex = isAddNextPage ? maxIndex + 1 : maxIndex;
    },
    // ページネーション
    pagingVacation() {
      this.dispVacation = definition.pagingItems(this.vacation, this.nowPageIndex);
    },
    nextPage() {
      this.nowPageIndex += 1;
      this.pagingVacation();
    },
    backPage() {
      this.nowPageIndex += -1;
      this.pagingVacation();
    },
    setPage(index) {
      this.nowPageIndex = index;
      this.pagingVacation();
    },
    // 休暇を申請
    async applyVacation(item) {
      try {
        await this.$store.dispatch('applyVacation', item);
        await this.$store.dispatch('getStaff', this.uid);
        this.searchVacation();
        this.daysLeft = this.$store.getters.getLoginUser.daysLeft;
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
        await this.$store.dispatch('getStaff', this.uid);
        this.searchVacation();
        this.daysLeft = this.$store.getters.getLoginUser.daysLeft;
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
