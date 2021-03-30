import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

createApp(App).use(store).use(router).mount('#app')

const firebaseConfig = {
  apiKey: "AIzaSyCgRgBuWgil7fTzhYYshYvBGW_cuL5uk_Y",
  authDomain: "vacationmanagementsystem-e7c43.firebaseapp.com",
  projectId: "vacationmanagementsystem-e7c43",
  storageBucket: "vacationmanagementsystem-e7c43.appspot.com",
  messagingSenderId: "536742346324",
  appId: "1:536742346324:web:ef03f842b2a3b36294b7c1"
};

firebase.initializeApp(firebaseConfig);
