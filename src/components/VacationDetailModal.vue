<template>
<div class="modalUser modalOverlay" @click.self="$emit('close')">
  <div class="modalWindow container-fluid modalWindow-extra-height">
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row align-items-center justify-content-end">
      <input type="button" class="btn btn-danger" value="閉じる" @click="$emit('close')">
    </div>
    <div class="row align-items-center justify-content-center mt-1">
      <table class="table-bordered">
        <tbody>
          <tr>
            <td class="width-12 text-center table-active">社員名</td>
            <td class="width-20 text-center">{{ val.staffName }}</td>
          </tr>
          <tr>
            <td class="width-12 text-center table-active">取得開始予定時間</td>
            <td class="width-20 text-center">{{ setDate(val.startDatetime) + ' ' + setTime(val.startDatetime) }}</td>
          </tr>
          <tr>
            <td class="width-12 text-center table-active">取得終了予定時間</td>
            <td class="width-20 text-center">{{ setDate(val.endDatetime) + ' ' + setTime(val.endDatetime) }}</td>
          </tr>
          <tr>
            <td class="width-12 text-center table-active">取得日数</td>
            <td class="width-20 text-center">{{ getVacationDays(val.startDatetime, val.endDatetime) }}日</td>  
          </tr>
          <tr>
            <td class="width-12 text-center table-active">休暇種別</td>
            <td class="width-20 text-center">{{ setTypeName(val.typeCd) }}</td>  
          </tr>
          <tr>
            <td class="width-12 text-center table-active">事由</td>
            <td class="width-20 text-center">{{ val.memo }}</td>  
          </tr>
          <tr v-if="setIsDispButton(val.applyStatusCd)">
            <td class="width-12 text-center table-active">却下理由</td>
            <td class="width-20 text-center">
              <input type="text" maxlength="20" v-model="reason">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row align-items-center justify-content-center mt-3"
      v-if="setIsDispButton(val.applyStatusCd)">
      <input type="button" class="btn btn-primary" value="承認" @click="$emit('approve')">
      <input type="button" class="btn btn-danger" value="却下" @click="reject">
    </div>
  </div>
</div>
</template>

<script>
import definition from '@/helper/definition'

export default {
  name: 'VacationDetail',
  props: ['val'],
  data () {
    return {
      codeStatus: null,
      reason: '',
      errorMessage: ''
    }
  },
  created () {
    this.codeStatus = definition.getCodeStatus();
  },
  methods: {
    setTypeName(typeCd) {
      return definition.setTypeName(typeCd);
    },
    setDate(datetime) {
      return definition.setDate(datetime);
    },
    setTime(datetime) {
      return definition.setTime(datetime);
    },
    setIsDispButton(applyStatusCd) {
      return applyStatusCd === this.codeStatus.applying.statusCd;
    },
    getVacationDays(startDatetime, endDatetime) {
      return definition.getVacationDays(startDatetime, endDatetime);
    },
    // 却下する
    reject() {
      if (this.reason === '') {
        this.errorMessage = '却下理由を入力してください';
        return;
      }
      this.$emit('reject', {
        reason: this.reason
      });
    }
  }
}
</script>

<style scoped>
tr {
  height: 50px;
}
.modalWindow-extra-height {
  height: 570px !important;
}
</style>
