<template>
  <section
    v-if="step === 'payment'"
    class="totals"
  >
    <h2>
      {{ $t('totals.summary') }}
    </h2>

    <p class="totals__item">
      {{ $t('totals.subtotal') }}

      <strong>
        {{ totals.subtotal | currency }}
      </strong>
    </p>

    <p class="totals__item">
      {{ $t('totals.shipping') }}

      <strong>
        {{ totals.shipping_amount | currency }}
      </strong>
    </p>

    <p
      v-if="parseInt(totals.tax_amount) !== 0"
      class="totals__item"
    >
      {{ $t('totals.tax') }}

      <strong>
        {{ totals.tax_amount | currency }}
      </strong>
    </p>

    <p
      v-if="parseInt(totals.discount_amount) !== 0"
      class="totals__item-dicsount"
    >
      {{ $t('totals.discount') }}

      <strong>
        {{ totals.discount_amount | currency }}
      </strong>
    </p>

    <p
      v-if="totals.subtotal !== totals.base_grand_total"
      class="totals__item-total"
    >
      {{ $t('totals.orderTotals') }}

      <strong>
        {{ totals.base_grand_total | currency }}
      </strong>
    </p>
  </section>
</template>

<script>
export default {
  computed: {
    totals () {
      return this.$store.getters.totals
    },
    step () {
      return this.$store.state.step
    }
  }
}
</script>

<style lang="scss" scoped>
  .totals {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #c2c2c2;
  }
</style>
