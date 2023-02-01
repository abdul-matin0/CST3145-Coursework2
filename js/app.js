const app = new Vue({
    el: '#app',
    data: {
        lessons: [],
        cart: [],
        sortBy: 'subject',  // default sorting value
        orderBy: 'ascending', // default order value
        name: '',
        search: '',
        phoneNumber: '',
        onHomePage: true,
        baseURL: 'http://localhost:3000'
    },
    // fetching the lessons in json from the get path
    created: function () {
        // using promise and fetch to get a list of lessons
        this.getLessons();
        this.getOrders();
    },
    methods: {
        // returns a new promise that will be resolved or rejected based on the result of the fetch call.
        getLessons() {
            fetch(`${this.baseURL}/lessons`).then(
                function (response) {
                    response.json().then(
                        function (json) {
                            // pushing lessons in json format into the lessons array
                            app.lessons = json;
                        }
                    )
                });
        },
        // returns a new promise that will be resolved or rejected based on the result of the fetch call.
        getOrders() {
            fetch(`${this.baseURL}/orders`).then(
                function (response) {
                    response.json().then(
                        function (json) {
                            // pushing lessons in json format into the lessons array
                            app.cart = json;
                        }
                    )
                });
        },
        /// A fetch that saves a new order with POST
        postOrderCollection(jsonData) {
            fetch(`${this.baseURL}/orders`, {
                method: "POST",
                body: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then(responseData => {
                    console.log(responseData);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        /// A fetch that:
        /// updates the available lesson space with PUT after an order
        /// updates the available space of order
        updateCollectionSpace(collectionName, jsonData, _id) {

            fetch(`${this.baseURL}/${collectionName}/${_id}`, {
                method: "PUT",
                body: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then(responseData => {
                    console.log(responseData);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        /// Delete item from collection
        deleteItemFromCollection(collectionName, jsonData, _id) {

            fetch(`${this.baseURL}/${collectionName}/${_id}`, {
                method: "DELETE",
                body: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then(responseData => {
                    console.log(responseData);
                })
                .catch(error => {
                    console.log(error);
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
                    var formattedOrder = { spaces: itemInCart.spaces }
                    this.updateCollectionSpace('orders', formattedOrder, itemInCart._id)
                } else {
                    // adding new item to cart
                    itemInCart = { lessonId: _id, spaces: 1, lesson: lesson, name: 'Ayo', phoneNumber: '099497329987' };
                    this.postOrderCollection(itemInCart);

                    // get _id of item added to cart for the first time
                    this.getOrders();
                }

                // update lesson space with put
                var formattedLesson = { spaces: lesson.spaces }
                this.updateCollectionSpace('lessons', formattedLesson, _id);
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

                this.deleteItemFromCollection('orders', formattedOrder, itemInCart._id)

                // redirect user back to home if cart is empty
                if (this.cart.length <= 0) {
                    this.togglePage();
                }
            } else {
                // reduce number of spaces of item in cart
                --itemInCart.spaces;

                // update order collection space with put
                var formattedOrder = { spaces: itemInCart.spaces }
                this.updateCollectionSpace('orders', formattedOrder, itemInCart._id)
            }

            // increase lesson space 
            var lesson = this.getLessonById(lessonId);
            ++lesson.spaces;

            // update lesson collection space with put
            var formattedLesson = { spaces: lesson.spaces }
            this.updateCollectionSpace('lessons', formattedLesson, lessonId);
        },
        // get lesson by id
        getLessonById(_id) {
            var lesson = this.lessons.find(u => u._id == _id);
            return lesson;
        },
        // get item in cart by id
        getCartItemFromCartByLessonId(lessonId) {
            var item = this.cart.find(u => u.lessonId == lessonId);

            return item;
        },
        // toggle page -> index -> cart
        togglePage() {
            this.onHomePage = !this.onHomePage;
        },
        // filter lesson based on sortBy selection
        sortLesson: function () {
            if (this.orderBy == 'ascending') {
                switch (this.sortBy) {
                    // filter by subject
                    case 'subject':
                        this.lessons.sort((a, b) => {
                            let x = a.subject.toLowerCase();
                            let y = b.subject.toLowerCase();
                            if (x < y) { return -1; }
                            if (x > y) { return 1; }
                            return 0;
                        })
                        break;
                    // filter by location
                    case 'location':
                        this.lessons.sort((a, b) => {
                            let x = a.location.toLowerCase();
                            let y = b.location.toLowerCase();
                            if (x < y) { return -1; }
                            if (x > y) { return 1; }
                            return 0;
                        })
                        break;
                    // filter by price
                    case 'price':
                        this.lessons.sort((a, b) => {
                            let x = a.price;
                            let y = b.price;
                            if (x < y) { return -1; }
                            if (x > y) { return 1; }
                            return 0;
                        })
                        break;
                    // filter by availability
                    case 'availability':
                        this.lessons.sort((a, b) => {
                            let x = a.spaces;
                            let y = b.spaces;
                            if (x < y) { return -1; }
                            if (x > y) { return 1; }
                            return 0;
                        })
                        break;
                }
            } else {
                switch (this.sortBy) {
                    // filter by subject
                    case 'subject':
                        this.lessons.sort((a, b) => {
                            let x = a.subject.toLowerCase();
                            let y = b.subject.toLowerCase();
                            if (x < y) { return 1; }
                            if (x > y) { return -1; }
                            return 0;
                        })
                        break;
                    // filter by location
                    case 'location':
                        this.lessons.sort((a, b) => {
                            let x = a.location.toLowerCase();
                            let y = b.location.toLowerCase();
                            if (x < y) { return 1; }
                            if (x > y) { return -1; }
                            return 0;
                        })
                        break;
                    // filter by price
                    case 'price':
                        this.lessons.sort((a, b) => {
                            let x = a.price;
                            let y = b.price;
                            if (x < y) { return 1; }
                            if (x > y) { return -1; }
                            return 0;
                        })
                        break;
                    // filter by availability
                    case 'availability':
                        this.lessons.sort((a, b) => {
                            let x = a.spaces;
                            let y = b.spaces;
                            if (x < y) { return 1; }
                            if (x > y) { return -1; }
                            return 0;
                        })
                        break;
                }
            }
        },
        // validate name
        validateNameInput() {
            let result = /^[a-zA-Z]+$/.test(this.name);
            return result;
        },
        // validate phone
        validatePhoneInput() {
            let result = /^\d+$/.test(this.phoneNumber);
            return result;
        },
        // dialog confirmation
        showConfirmationDialog() {
            alert('Order has been submitted successfully')
        }
    },
    computed: {
        // filter lesson list based on search
        filteredLessonList: function () {
            console.log(this.lessons)

            const lessons = this.lessons.filter(
                (lesson) =>
                    lesson.topic.toLowerCase().includes(this.search.toLowerCase()) ||
                    lesson.location.toLowerCase().includes(this.search.toLowerCase())
            );

            return this.lessons
        },
        // disable cart button if no item is existing in the cart
        disableCartButton: function () {
            return this.cart.length <= 0 ? true : false;
        },
        // enable/disable checkout button if name and phoneNumber input is valid
        enableCheckoutButton: function () {
            var nameIsValid = this.validateNameInput();
            var phoneIsValid = this.validatePhoneInput();

            if (nameIsValid && phoneIsValid) {
                return true;
            }
            return false
        }
    },
    watch: {
        sortBy: function () {
            this.sortLesson();
        },
        orderBy: function () {
            this.sortLesson()
        }
    }
});