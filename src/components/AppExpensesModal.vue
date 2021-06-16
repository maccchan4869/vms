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
            <td class="width-12 text-center">利用日</td>
            <td class="width-20 text-center">
              <input type="date" v-model="useDate">
            </td>
          </tr>
          <tr>
            <td class="width-12 text-center">金額</td>
            <td class="width-20 text-center">
              <input type="number" placeholder="0" min="0" max="100000" v-model.number="money">円
            </td>
          </tr>
          <tr>
            <td class="width-12 text-center">使用用途</td>
            <td class="width-20 text-center">
              <input type="text" maxlength="20" v-model="memo">
            </td>
          </tr>
          <tr>
            <td class="width-12 text-center">領収書</td>
            <td class="width-20 text-center">
              <input type="file" accept="image/jpeg, image/png" @change="onImageChange"/>
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
import definition from '@/helper/definition'

export default {
  name: 'AppExpensesModal',
  created() {
    this.useDate = new Date();
    this.codeStatus = definition.getCodeStatus();
    const today = new Date();
    this.useDate = `${today.getFullYear()}-${('0'+(today.getMonth() + 1)).slice(-2)}-${('0'+today.getDate()).slice(-2)}`;
  },
  data () {
    return {
      useDate: '',
      money: 0,
      memo: '',
      image: '',
      codeStatus: null,
      errorMessage: ''
    }
  },
  methods: {
    getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      })
    },
    async onImageChange (e) {
      try {
        const inputFile = e.target.files || e.dataTransfer.files;
        if (typeof inputFile[0] === 'undefined') {
          this.image = '';
          return;
        }
        this.image = await this.getBase64(inputFile[0]);
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '取り込みに失敗しました';
        console.error(error);
      }
    },
    // 入力データチェック
    validationInputData() {
      if(isNaN(Date.parse(this.useDate))) {
        this.errorMessage = '日付の入力値が不正です';
        return;
      }
      if(this.money === 0) {
        this.errorMessage = '金額を入力してください';
        return;
      }
      if(this.memo === '') {
        this.errorMessage = '使用用途を入力してください';
        return;
      }
      if(this.image === '') {
        this.errorMessage = '領収書等の画像を添付してください';
        return;
      }
      console.log(this.image);
      /* this.$emit('apply', {
        useDate: this.useDate,
        money: this.money,
        applyStatusCd: this.codeStatus.applying.statusCd,
        memo: this.memo,
        image: this.image
      }); */
    }
  }
}
</script>

<style scoped>
tr {
  height: 50px;
}
</style>
