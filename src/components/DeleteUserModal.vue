<template>
<div class="modalUser modalOverlay" @click.self="$emit('close')">
  <div class="modalWindow modalWindow-medium container-fluid">
    <div class="row align-items-center justify-content-center mt-5">
      <div><label>ユーザーを削除しますがよろしいですか？</label></div>
      <div><label>一度削除したユーザーの情報は復元することができません。</label></div>
    </div>
    <div class="row align-items-center justify-content-center">
      <div class="mt-4">
        <input type="button" class="btn btn-primary" value="OK" @click="$emit('delete')">
        <input type="button" class="btn btn-danger" value="キャンセル" @click="$emit('close')">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'DeleteUserModal',
}
</script>