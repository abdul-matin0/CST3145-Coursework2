<template>
    <div class="row">
        <!-- lessons -->
        <div class="col-sm-6 col-md-6 col-lg-4 mt-2" v-for="item in cart">
            <div class="card card-width rounded-0 shadow-sm">
                <div class="card-body d-flex justify-content-between">
                    <div>
                        <span class="card-text fs-14">Subject:
                            <b class="card-subtitle mb-2 fs-14">{{ item.lesson.topic }}</b></span><br />
                        <span class="card-text fs-14">Location:
                            <b class="card-subtitle mb-2 fs-14">{{ item.lesson.location }}</b></span><br />
                        <span class="card-text fs-14">Price:
                            <b class="card-subtitle mb-2 fs-14">£{{ item.lesson.price }}</b></span><br />
                        <span class="card-text fs-14">Spaces:
                            <b class="card-subtitle mb-2 fs-14">{{ item.spaces }}</b></span><br />
                        <span class="card-text fs-18"><i v-bind:class="item.lesson.icon"></i></span><br />

                        <button @click="removeFromCart(item.lessonId)"
                            class="card-link btn btn-dark btn-sm mt-md-5 px-lg-2">
                            <i class="fas fa-minus mx-1"></i> Remove
                        </button>
                    </div>
                    <img v-bind:src="baseURL + '/' + item.lesson.imageURL" v-bind:alt="item.lesson.altText"
                        class="img-fluid border rounded" style="height: 202px; width: 120px; object-fit: cover" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Checkout",
    props: ["cart", "baseURL"],
    methods: {
        removeFromCart: function (_id) {
            // emits a custom event that triggers the parent component to remove a lesson from cart
            this.$emit("remove-from-cart", _id);
        }
    }
}
</script>