<template>
<nav aria-label="Page-navigation">
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" @click.prevent.stop="$emit('back')">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="page-item" v-for="index in maxPageIndex" :key="index">
      <a class="page-link" href="#" @click.prevent.stop="setPage(index)">{{ index }}</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next" @click.prevent.stop="$emit('next')">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['maxPageIndex'],
  methods: {
    setPage(index) {
      this.$emit('setPage', index);
    }
  }
}
</script>
