<template>
  <div class="expenses container-fluid">
    <Header/>
    <div class="row justify-content-center common-padding">
      <div><label class="errorMessage">{{ errorMessage }}</label></div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'Expenses',
  components: {
    Header
  },
  data () {
    return {
      errorMessage: ''
    }
  },
  methods: {
  }
}
</script>
