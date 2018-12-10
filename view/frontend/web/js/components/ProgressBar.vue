<template>
  <div
    v-if="step !== 'success'"
    class="progress-bar"
  >
    <h1>
      <span
        :class="[
          'progress-bar__item',
          { 'progress-bar__item--active': step === 'shipping' }
        ]"
      >
        {{ $t('steps.shipping') }}
      </span>/
      <span
        :class="[
          'progress-bar__item',
          { 'progress-bar__item--active': step === 'payment' }
        ]"
      >
        {{ $t('steps.payment') }}
      </span>
    </h1>
  </div>
</template>

<script>
export default {
  computed: {
    step () {
      return this.$store.state.step
    }
  }
}
</script>

<style lang="scss">
.progress-bar {
  &__item {
    color: #ccc;

    &--active {
      color: #000;
    }
  }
}
</style>
