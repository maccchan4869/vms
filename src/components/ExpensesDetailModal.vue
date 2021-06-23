<template>
<div class="modalUser modalOverlay" @click.self="$emit('close')">
  <div class="modalWindow container-fluid modalWindow-extra-height">
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
    <div class="row align-items-center">
      <div class="col-11 text-right">
        <input type="button mr-5" class="btn-icon" @click="$emit('close')">
      </div>
    </div>
    <div class="row align-items-center justify-content-center mt-1">
      <table class="table-bordered">
        <tbody>
          <tr>
            <td class="width-12 text-center table-active">社員名</td>
            <td class="width-20 text-center">{{ val.staffName }}</td>
          </tr>
          <tr>
            <td class="width-12 text-center table-active">使用日</td>
            <td class="width-20 text-center">{{ setDate(val.useDate) }}</td>
          </tr>
          <tr>
            <td class="width-12 text-center table-active">金額</td>
            <td class="width-20 text-center">{{ setComma(val.money) }}円</td>
          </tr>
          <tr>
            <td class="width-12 text-center table-active">事由</td>
            <td class="width-20 text-center">{{ val.memo }}</td>  
          </tr>
           <tr>
            <td class="width-12 text-center table-active">
              <div>領収書</div>
              <div><a :href="imageUrl">ダウンロード</a></div>
            </td>
            <td class="width-20 text-center"><img :src="imageUrl" class="image"></td>  
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
  name: 'ExpensesDetail',
  props: ['val'],
  data () {
    return {
      codeStatus: null,
      imageUrl: '',
      reason: '',
      errorMessage: ''
    }
  },
  created () {
    this.imageUrl =  this.$store.getters.getImageUrl;
    this.codeStatus = definition.getCodeStatus();
  },
  methods: {
    setComma(money) {
      return money.toLocaleString();
    },
    setDate(date) {
      const datetime = new Date(date);
      return definition.setDate(datetime);
    },
    setIsDispButton(applyStatusCd) {
      return applyStatusCd === this.codeStatus.applying.statusCd;
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
    },
    // 画像をローカルに保存する
    download() {
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
  height: 700px !important;
}
.image {
  width: 300px;
  height: 250px;
}
</style>
