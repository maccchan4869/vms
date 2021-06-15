<template>
<div class="row common-padding">
  <div class="container">
    <nav aria-label="Page-navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent.stop="backPage"
          :class="{disabled: backDisabled(maxPageIndex)}">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item" v-for="index in maxPageIndex" :key="index">
          <a class="page-link" href="#" @click.prevent.stop="setPage(index)" :class="{selected: isSelect(index)}">{{ index }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next" @click.prevent.stop="nextPage"
          :class="{disabled: nextDisabled(maxPageIndex)}">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['maxPageIndex'],
  data () {
    return {
      nowPageIndex: 1
    }
  },
  methods: {
    setPage(index) {
      this.nowPageIndex = index;
      this.$emit('setPage', this.nowPageIndex);
    },
    nextPage() {
      this.nowPageIndex += 1;
      this.$emit('setPage', this.nowPageIndex);
    },
    backPage() {
      this.nowPageIndex += -1;
      this.$emit('setPage', this.nowPageIndex);
    },
    backDisabled(maxPageIndex) {
      return this.nowPageIndex === 1 || maxPageIndex === 0;
    },
    nextDisabled(maxPageIndex) {
      return maxPageIndex === 1 || this.nowPageIndex === maxPageIndex || maxPageIndex === 0;
    },
    isSelect(index) {
      return this.nowPageIndex === index;
    }
  }
}
</script>

<style scoped>
.disabled {
  color: darkgrey;
  pointer-events: none;
}
.selected {
  font-weight: bold;
  border-radius: 6px;
}
</style>
