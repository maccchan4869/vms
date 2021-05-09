<template>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 20px;
}

ul{
  list-style: none;
}

.row {
  margin-top: 1rem;
  padding: 0 10rem;
}

.cellTitle {
  width: 180px;
  text-align: center;
}

.errorMessage {
  color: red;
  line-height: 20px;
}

.modalOverlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modalOverlay .modalWindow {
  min-width: 50%;
  height: 45%;
  font-size: 20px;
  border-radius: 4px;
  background: #fff;
  position: relative;
  padding-top: 1%;
}

.modalOverlay .modalWindow .btn {
  margin: 0 2rem;
}
</style>
