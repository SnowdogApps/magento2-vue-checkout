<template>
  <section v-if="step === 'success'">
    <h1> {{ $t('Thank you for your purchase!') }}</h1>
    <template v-if="orderId !== null">
      {{ $t('Your order number is', { orderId: orderId }) }}
    </template>
    <p>{{ $t('We\'ll email you an order confirmation with details and tracking info.') }}</p>
    <a href="/">
      {{ $t('Continue shopping') }}
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
