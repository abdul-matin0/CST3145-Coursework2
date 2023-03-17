<script setup>
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <div id="app">
    <header>
      <h1>{{ sitename }}</h1>
      <button class="disabled card-link btn btn-dark btn-sm px-3"><i
                            class="fas fa-arrow-right mx-2"></i>Go
                        to cart</button>
      <button @click="showCheckout">{{ this.cart.length }}
        Checkout</button>
    </header>
    <main>
      <component :is="currentView"></component>
    </main>
  </div>
</template>
<script>
import ProductList from "./components/Lesson.vue";
import Checkout from "./components/Checkout.vue";
export default {
  name: "App",
  data() {
    return {
      sitename: "Vue.js Pet Depot",
      cart: [],
      currentView: ProductList
    }
  },
  components: { ProductList, Checkout },

  methods: {
    showCheckout() {
      if (this.currentView === Checkout)
        this.currentView = ProductList
      else this.currentView = Checkout;
    }
  }
}
</script>

<style scoped>

</style>
