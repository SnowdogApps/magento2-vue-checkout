<template>
  <div v-if="step !== 'success'" class="v-progress-bar">
    <h1>
      <span
        :class="[
          'vprogress-bar__item',
          { 'v-progress-bar__item--active': step === 'shipping' },
        ]"
      >
        Shipping Step </span
      >/
      <span
        :class="[
          'v-progress-bar__item',
          { 'v-progress-bar__item--active': step === 'payment' },
        ]"
      >
        Review & Payments Step
      </span>
    </h1>
  </div>
</template>

<script>
export default {
  computed: {
    step() {
      // return this.$store.state.step
      return "shipping";
    },
  },
};
</script>

<style>
.v-progress-bar__item {
  color: #ccc;
}

.v-progress-bar__item--active {
  color: #000;
}
</style>
