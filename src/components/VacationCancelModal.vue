<template>
<div class="modalUser modalOverlay" @click.self="$emit('close')">
  <div class="modalWindow container-fluid">
    <div class="row align-items-center justify-content-center">
      <label class="errorMessage">{{ errorMessage }}</label>
    </div>
    <div class="row align-items-center justify-content-center">
      <label>申請を取消ますか？</label>
    </div>
    <div class="row align-items-center justify-content-center">
      <div class="mt-4">
        <input type="button" class="btn btn-primary" value="OK" @click="$emit('close')">
        <input type="button" class="btn btn-danger" value="キャンセル" @click="$emit('close')">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'VacationCancelModal',
  created() {
  },
  data () {
    return {
      errorMessage: '',
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
