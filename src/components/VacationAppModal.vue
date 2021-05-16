<template>
<div class="modalUser modalOverlay" @click.self="$emit('close')">
  <div class="modalWindow container-fluid">
    <div class="row align-items-center justify-content-center mt-5">
      <label class="errorMessage">{{ errorMessage }}</label>
    </div>
    <div class="row align-items-center justify-content-center">
      <table>
        <tbody>
          <tr>
            <td class="width-12 text-center">取得開始予定時間</td>
            <td class="width-20 text-center">
              <input type="date" v-model="startDate">
              <input type="time" v-model="startTime">
            </td>
          </tr>
          <tr>
            <td class="width-12 text-center">取得終了予定時間</td>
            <td class="width-20 text-center">
              <input type="date" v-model="endDate">
              <input type="time" v-model="endTime">
            </td>
          </tr>
          <tr>
            <td class="width-12 text-center">休暇種別</td>
            <td class="width-20 text-center">
              <select v-model="typeCd">
                <option v-for="typeOption in typeOptions" :value="typeOption.typeCd" v-bind:key="typeOption.typeCd">{{ typeOption.typeName }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="width-12 text-center">メモ</td>
            <td class="width-20 text-center">
              <input type="text" maxlength="20" v-model="memo">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row align-items-center justify-content-center mt-4">
        <input type="button" class="btn btn-primary" value="申請" @click="validationInputData">
        <input type="button" class="btn btn-danger" value="キャンセル" @click="$emit('close')">
      </div>
  </div>
</div>
</template>

<script>
import definition from "@/helper/definition"
export default {
  name: 'VacationAppModal',
  created() {
    const today = new Date();
    const strToday = `${today.getFullYear()}-${('0'+(today.getMonth() + 1)).slice(-2)}-${('0'+today.getDate()).slice(-2)}`;
    this.startDate = strToday;
    this.endDate = strToday;
    this.codeStatus = definition.getCodeStatus();
    this.typeOptions = definition.getCodeType();
  },
  data () {
    return {
      errorMessage: '',
      startDate: '',
      startTime: '09:00',
      endDate: '',
      endTime: '18:00',
      typeCd: '0',
      memo: '',
      codeStatus: null,
      typeOptions: null
    }
  },
  methods: {
    // 入力データチェック
    validationInputData() {
      const startUnixTime = Date.parse(`${this.startDate} ${this.startTime}`);
      const endUnixTime = Date.parse(`${this.endDate} ${this.endTime}`);
      const startDatetime = new Date(startUnixTime);
      const endDatetime = new Date(endUnixTime);
      if(isNaN(startUnixTime) || isNaN(endUnixTime)) {
        this.errorMessage = '日付の入力値が不正です';
        return;
      }
      if(!this.startTime || !this.endTime) {
        this.errorMessage = '時刻の入力値が不正です';
        return;
      }
      if(startDatetime > endDatetime) {
        this.errorMessage = '開始時間と終了時間の順序に誤りがあります';
        return;
      }
      this.$emit('apply', {
        startDatetime: startDatetime,
        endDatetime: endDatetime,
        typeCd: this.typeCd,
        applyStatusCd: this.codeStatus.applying.statusCd,
        memo: this.memo
      });
    }
  }
}
</script>

<style scoped>
tr {
  height: 50px;
}
</style>
