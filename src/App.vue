
<template>
  <div class="container py-5 px-md-5" id="app">
    <p class="text-center">{{ sitename }}</p>
    <hr />
    <div class="row mb-3 text-center">
      <div class="col-12">
        <button class="card-link btn btn-dark btn-sm px-3 text-center" @click="showCheckout"><i
            class="fas fa-arrow-right mx-2"></i>Go
          to cart {{ this.cart.length }}</button>
      </div>
    </div>

    <!-- main -->
    <div class="row pt-2">
      <main>
        <component :is="currentView" :lessonList="lessons" :baseURL="baseURL" @add-to-cart="addToCart" :cart="cart">
        </component>
      </main>
    </div>
  </div>
</template>
<script>
import LessonComponent from "./components/Lesson.vue";
import CheckoutComponent from "./components/Checkout.vue";
export default {
  name: "App",
  data() {
    return {
      sitename: "CST3145",
      currentView: LessonComponent,
      lessons: [],
      cart: [],
      sortBy: 'subject',  // default sorting value
      orderBy: 'ascending', // default order value
      name: '',
      search: '',
      phoneNumber: '',
      baseURL: 'https://cst3145-env.eba-9sjt9wkg.eu-west-2.elasticbeanstalk.com'
    }
  },
  components: { LessonComponent, CheckoutComponent },
  // fetching the lessons in json from the get path
  created: function () {
    // using promise and fetch to get a list of lessons
    this.getLessons();
  },
  methods: {
    /// returns a new promise that will be resolved or rejected based on the result of the fetch call.
    getLessons() {
      let webstore = this
      fetch(`${this.baseURL}/lessons`).then(
        function (response) {
          response.json().then(
            function (json) {
              // pushing lessons in json format into the lessons array
              webstore.lessons = json;
            }
          )
        });
    },

    // adds a lesson to cart
    addToCart(_id) {
      // find selected lesson id
      var lesson = this.getLessonById(_id);
      if (lesson.spaces > 0) {
        // decrease lesson space
        --lesson.spaces;

        // get existing item from cart
        var itemInCart = this.getCartItemFromCartByLessonId(_id);

        if (itemInCart != null) {
          // update existing item in cart with put
          ++itemInCart.spaces;

        } else {
          // adding new item to cart
          itemInCart = { lessonId: _id, spaces: 1, lesson: lesson };
          this.cart.push(itemInCart);
        }
      }
    },
    // removes a lesson from cart
    removeFromCart(lessonId) {
      // find selected lesson in cart
      var itemInCart = this.getCartItemFromCartByLessonId(lessonId);

      if (itemInCart.spaces == 1) {
        // if just one item space is left, remove item completely from cart
        var index = this.cart.map(x => x.lessonId).indexOf(lessonId);
        this.cart.splice(index, 1);

        // redirect user back to home if cart is empty
        if (this.cart.length <= 0) {
          this.showCheckout();
        }
      } else {
        // reduce number of spaces of item in cart
        --itemInCart.spaces;
      }

      // increase lesson space 
      var lesson = this.getLessonById(lessonId);
      ++lesson.spaces;
    },
    // get lesson by id
    getLessonById(_id) {
      var lesson = this.lessons.find(u => u._id == _id);
      return lesson;
    },
    getCartItemFromCartByLessonId(lessonId) {
      var item = this.cart.find(u => u.lessonId == lessonId);
      return item;
    },
    showCheckout() {
      if (this.currentView === CheckoutComponent)
        this.currentView = LessonComponent
      else this.currentView = CheckoutComponent;
    }
  }
}
</script>
