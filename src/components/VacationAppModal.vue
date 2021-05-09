<template>
<div class="modalUser modalOverlay" @click.self="$emit('close')">
  <div class="modalWindow container-fluid">
    <div class="row align-items-center justify-content-center">
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
      <div class="mt-4">
        <input type="button" class="btn btn-primary" value="申請" @click="validationInputData">
        <input type="button" class="btn btn-danger" value="キャンセル" @click="$emit('close')">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'VacationAppModal',
  created() {
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
      typeOptions: [
        {typeCd: '0', typeName: '有給休暇'},
        {typeCd: '1', typeName: '半休休暇'},
        {typeCd: '2', typeName: '早退'},
        {typeCd: '3', typeName: '欠勤'},
      ]
    }
  },
  methods: {
    // 入力データチェック
    validationInputData() {
      const startDatetime = new Date(Date.parse(this.startDate + ' ' + this.startTime));
      const endDatetime = new Date(Date.parse(this.endDate + ' ' + this.endTime));
      if(startDatetime > endDatetime) {
        this.errorMessage = '入力値が不正です';
        return;
      }
      this.$emit('apply', {
        startDatetime: startDatetime,
        endDatetime: endDatetime,
        typeCd: this.typeCd,
        applyStatusCd: '0',
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
