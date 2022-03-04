<template>
  <section v-if="step === 'success'">
    <h1>Thank you for your purchase!</h1>
    <template v-if="orderId !== null">
      Your order number is: {{ orderId }}.
    </template>
    <p>We'll email you an order confirmation with details and tracking info.</p>
    <a href="/"> Continue shopping </a>
  </section>
</template>

<script>
export default {
  computed: {
    cartId() {
      return this.$store.getters.cartId
    },
    step() {
      return this.$store.state.step
    },
    orderId() {
      return this.$store.state.orderId
    }
  }
}
</script>
