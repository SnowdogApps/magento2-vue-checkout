<template>
  <section v-if="step === 'success'">
    We did it!

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
    }
  }
}
</script>
