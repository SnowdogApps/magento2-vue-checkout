<template>
  <section v-if="step === 'success'">
    <h1> {{ $t('success.finished') }}</h1>
    <template v-if="orderId !== null">
      {{ $t('success.orderNumber', { orderId: orderId }) }}
    </template>
    <p>{{ $t('success.emailDetails') }}</p>
    <a href="/">
      {{ $t('success.continueShopping') }}
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
