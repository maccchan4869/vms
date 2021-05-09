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

/* =============================================
HTML要素
============================================= */
ul{
  list-style: none;
}

input[type="date"], 
input[type="time"] { 
  margin: 5px; 
}

input[type="button"]{ 
  width: 100px; 
}

/* =============================================
共通クラス
============================================= */
.common-padding {
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

.width-8 {
 width: 8rem;
}

.width-12 {
 width: 12rem;
}

.width-20 {
 width: 20rem;
}

/* =============================================
モーダル共通クラス
============================================= */
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
  max-width: 50%;
  height: 50%;
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
