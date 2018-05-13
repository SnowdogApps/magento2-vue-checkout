<template>
  <section v-if="step === 'success'">
    We did it!
    <template v-if="orderId !== null">
      Your order id is {{ orderId }}.
    </template>
    <a href="/what-is-new.html">
      Back to category
    </a>
  </section>
</template>

<script>
export default {
  computed: {
    cartId () {
      return this.$store.getters.cartId
    },
    step () {
      return this.$store.state.step
    },
    orderId () {
      return this.$store.state.orderId
    }
  }
}
</script>
