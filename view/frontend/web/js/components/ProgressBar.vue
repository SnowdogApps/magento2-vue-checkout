<template>
  <h1
    v-if="step !== 'success'"
    class="v-progress-bar"
  >
    <span
      :class="[
        'v-progress-bar__item',
        { 'v-progress-bar__item--active': step === 'shipping' }
      ]"
    >
      Shipping Step </span>/

    <span
      :class="[
        'v-progress-bar__item',
        { 'v-progress-bar__item--active': step === 'payment' }
      ]"
    >
      Review & Payments Step
    </span>
  </h1>
</template>

<script>
import { mapState } from 'pinia'
import { useStore } from '@/store/index.js'

export default {
  computed: {
    ...mapState(useStore, ['step'])
  }
}
</script>

<style>
.v-progress-bar__item {
  color: #ccc;
}

.v-progress-bar__item--active {
  color: #000;
}
</style>
