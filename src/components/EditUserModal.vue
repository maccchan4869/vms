<template>
<div class="modalUser modalOverlay" @click.self="$emit('close')">
  <div class="modalWindow modalWindow-small container-fluid">
    <div class="row align-items-center justify-content-center">
      <table>
        <tbody>
          <tr>
            <td class="width-12 text-center">社員名</td>
            <td class="width-20 text-center">{{ val.staffName }}</td>
          </tr>
          <tr>
            <td class="width-12 text-center">残休暇日数</td>
            <td class="width-20 text-center">{{ setDaysLeft(val) }}</td>
          </tr>
          <tr>
            <td class="width-12 text-center">変更後日数</td>
            <td class="width-20 text-center">
              <input type="number" placeholder="0" min="0" max="40" v-model.number="dayLeft">日
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row align-items-center justify-content-center mt-4">
      <input type="button" class="btn btn-primary" value="変更" @click="edit">
      <input type="button" class="btn btn-danger" value="キャンセル" @click="$emit('close')">
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'EditUserModal',
  props: ['val'],
  data () {
    return {
      dayLeft: 0
    }
  },
  methods: {
    edit() {
      this.$emit('edit', this.dayLeft);
    },
    setDaysLeft(staff) {
      return `${staff.daysLeft}日`;
    },
  }
}
</script>