<template>
<div class="modalUser modalOverlay" @click.self="$emit('close')">
  <div class="modalWindow container-fluid">
    <div><label class="errorMessage">{{ errorMessage }}</label></div>
    <div class="row align-items-center justify-content-center mt-2">
      <div class="cellTitle">社員名</div>
      <div><input type="text" placeholder="StaffName" v-model="staffName"></div>
    </div>
    <div class="row align-items-center justify-content-center mt-2">
      <div class="cellTitle">メールアドレス</div>
      <div><input type="text" placeholder="E-mail" v-model="email"></div>
    </div>
    <div class="row align-items-center justify-content-center mt-2">
      <div class="cellTitle">入社年月日</div>
      <select v-model="joiningDate.year" @change="getMaxDay">
        <option v-for="yearOption in yearOptions" :value="yearOption" v-bind:key="yearOption">{{ yearOption }}</option>
      </select>年
      <select v-model="joiningDate.month" @change="getMaxDay">
        <option v-for="month in 12" :value="month" v-bind:key="month">{{ month }}</option>
      </select>月
      <select v-model="joiningDate.day">
        <option v-for="day in maxDay" :value="day" v-bind:key="day">{{ day }}</option>
      </select>日
    </div>
    <div class="row align-items-center justify-content-center mt-2">
      <div class="cellTitle">パスワード</div>
      <div><input type="password" placeholder="Password" v-model="password"></div>
    </div>
    <div class="row align-items-center justify-content-center mt-2">
      <div class="cellTitle">権限</div>
      <label class="mr-2"><input class="mr-1" type="radio" value="1" v-model="admin">管理者</label>
      <label><input class="mr-1" type="radio" value="0" v-model="admin">スタッフ</label>
    </div>
    <div class="row align-items-center justify-content-center mt-3">
      <input type="button" class="btn btn-primary" value="登録" @click="validationInputData">
      <input type="button" class="btn btn-danger" value="キャンセル" @click="$emit('close')">
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'RegisterUserModal',
  data () {
    return {
      staffName: '',
      email: '',
      joiningDate: {
        year: 2021,
        month: 1,
        day: 1
      },
      password: '',
      admin: '0',
      errorMessage: '',
      maxDay: 1,
      yearOptions: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
    }
  },
  created() {
    this.getMaxDay();
  },
  methods: {
    // 最大日数を取得
    getMaxDay() {
      // 年、月どちらかが変更された場合、必ず1日に戻す
      this.joiningDate.day = 1;
      this.maxDay = new Date(this.joiningDate.year, this.joiningDate.month, 0).getDate();
    },
    // 入力データチェック
    validationInputData() {
      if(!this.staffName || !this.email || !this.password) {
        this.errorMessage = '必須項目が入力されていません';
        return;
      }
      this.$emit('register', {
        staffName: this.staffName,
        email: this.email,
        joiningDate: this.joiningDate,
        password: this.password,
        admin: this.admin === '1'
      });
    }
  }
}
</script>
